import axios from 'axios'
import countries from 'data/countries.json'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const DEFAULT_SUGGESTIONS_COUNT = 10
const MAX_LOCAL_MATCHES = 5
const MAX_TOTAL_RESULTS = 15

interface SearchResult {
  type: 'country' | 'network' | 'domain' | 'special'
  key: string | number
  name: string
  href: string
}

interface LocalOption extends SearchResult {
  haystack: string
}

// Countries and themes are filtered client-side against their localized
// names (the API only searches domains and networks for text queries).
// English aliases keep English queries working in every locale.
const SPECIAL_OPTIONS = [
  {
    key: 'circumvention',
    name: 'Circumvention tools',
    aliases: 'circumvention tools vpn tor psiphon proxy',
  },
  {
    key: 'social-media',
    name: 'Social media',
    aliases: 'social media facebook twitter instagram whatsapp telegram',
  },
  {
    key: 'news-media',
    name: 'News media',
    aliases: 'news media press journalism',
  },
  {
    key: 'human-rights',
    name: 'Human rights',
    aliases: 'human rights ngo advocacy',
  },
]

const fetcher = (
  args: string | [string, Record<string, string>],
): Promise<SearchResult[]> => {
  const [url, params] = Array.isArray(args) ? args : [args, undefined]
  return axios.get(url, { params }).then((res) => res.data?.results ?? [])
}

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const ExploreBar = () => {
  const intl = useIntl()
  const router = useRouter()
  const listboxId = useId()

  const containerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: debounce identity must be stable
  const debouncedSetQuery = useMemo(() => debounce(setQuery, 200), [])
  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery])

  const { data: defaultPool } = useSWR<SearchResult[]>(
    hasOpened ? '/api/search' : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  const trimmedQuery = query.trim()
  const { data: searchResults } = useSWR<SearchResult[]>(
    hasOpened && trimmedQuery ? ['/api/search', { q: trimmedQuery }] : null,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  const localOptions = useMemo<LocalOption[]>(() => {
    const lower = (value: string) => value.toLocaleLowerCase(intl.locale)
    const specials = SPECIAL_OPTIONS.map(({ key, name, aliases }) => {
      const localizedLabel = intl.formatMessage({
        id: `Home.ExploreBar.Special.${key}`,
        defaultMessage: name,
      })
      return {
        type: 'special' as const,
        key,
        name,
        href: `/${key}`,
        haystack: `${lower(localizedLabel)} ${aliases}`,
      }
    })
    const countryOptions = countries.map(({ alpha_2, name }) => ({
      type: 'country' as const,
      key: alpha_2,
      name,
      href: `/country/${alpha_2}`,
      haystack: lower(
        `${getLocalisedRegionName(alpha_2, intl.locale)} ${name} ${alpha_2}`,
      ),
    }))
    return [...specials, ...countryOptions]
  }, [intl])

  // One random mix per visit: server domains/networks plus locally sourced
  // (localized) countries and themes, since the API pool is domains/networks.
  const defaultSuggestions = useMemo(() => {
    if (!defaultPool) return []
    const specials = shuffle(localOptions.filter((o) => o.type === 'special'))
    const countryOptions = shuffle(
      localOptions.filter((o) => o.type === 'country'),
    )
    // Exactly two countries and one theme, plus domains/networks to fill
    const required = [...countryOptions.slice(0, 2), ...specials.slice(0, 1)]
    const rest = shuffle(defaultPool).slice(
      0,
      Math.max(0, DEFAULT_SUGGESTIONS_COUNT - required.length),
    )
    return shuffle([...required, ...rest])
  }, [defaultPool, localOptions])

  // Instant, locale-aware matches for countries and themes; no request needed
  const trimmedInput = inputValue.trim()
  const localMatches = useMemo(() => {
    const q = trimmedInput.toLocaleLowerCase(intl.locale)
    if (!q) return []
    const wordPrefix = ` ${q}`
    const prefixMatches: LocalOption[] = []
    const containsMatches: LocalOption[] = []
    for (const option of localOptions) {
      if (
        option.haystack.startsWith(q) ||
        option.haystack.includes(wordPrefix)
      ) {
        prefixMatches.push(option)
      } else if (option.haystack.includes(q)) {
        containsMatches.push(option)
      }
    }
    return [...prefixMatches, ...containsMatches].slice(0, MAX_LOCAL_MATCHES)
  }, [trimmedInput, localOptions, intl.locale])

  const options = useMemo(
    () =>
      trimmedInput
        ? [...localMatches, ...(searchResults ?? [])].slice(
            0,
            MAX_TOTAL_RESULTS,
          )
        : defaultSuggestions,
    [trimmedInput, localMatches, searchResults, defaultSuggestions],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset highlight when the visible list changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [options])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const openDropdown = () => {
    setIsOpen(true)
    setHasOpened(true)
  }

  const selectOption = (option: SearchResult) => {
    setIsOpen(false)
    router.push(option.href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      openDropdown()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(options.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(
        (i) =>
          (i - 1 + Math.max(options.length, 1)) % Math.max(options.length, 1),
      )
    } else if (e.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
      e.preventDefault()
      selectOption(options[activeIndex])
    }
  }

  const optionLabel = (option: SearchResult) => {
    switch (option.type) {
      case 'country':
        return getLocalisedRegionName(option.key, intl.locale)
      case 'network':
        return (
          <>
            <span>AS{option.key}</span>
            {option.name && <span> · {option.name}</span>}
          </>
        )
      case 'special':
        return intl.formatMessage({
          id: `Home.ExploreBar.Special.${option.key}`,
          defaultMessage: option.name,
        })
      default:
        return option.name
    }
  }

  return (
    <div className="relative max-w-125 mx-auto mt-12 md:mt-20" ref={containerRef}>
      <div className="relative">
        <MdSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500"
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label={intl.formatMessage({ id: 'Home.ExploreBar.Placeholder' })}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-full bg-white pl-12 pr-5 py-3 text-lg text-blue-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-300"
          placeholder={intl.formatMessage({ id: 'Home.ExploreBar.Placeholder' })}
          value={inputValue}
          onFocus={openDropdown}
          onClick={openDropdown}
          onChange={(e) => {
            setInputValue(e.target.value)
            debouncedSetQuery(e.target.value)
            openDropdown()
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-2 w-full max-h-100 overflow-y-auto rounded-lg bg-white py-2 text-left text-blue-900 shadow-lg px-2"
        >
          {options.map((option, index) => (
            <li
              key={`${option.type}-${option.key}`}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`flex items-center gap-3 px-2 py-2 cursor-pointer ${
                index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault()
                selectOption(option)
              }}
            >
              <MdSearch
                aria-hidden="true"
                className="shrink-0 text-xl text-gray-400"
              />
              <span className="truncate">{optionLabel(option)}</span>
              <span className="ml-auto shrink-0 text-xs uppercase tracking-wide text-gray-500">
                {intl.formatMessage({
                  id: `Home.ExploreBar.Type.${option.type}`,
                })}
              </span>
            </li>
          ))}
          {options.length === 0 && (
            <li className="px-5 py-2 text-gray-500">
              {intl.formatMessage({ id: 'Home.ExploreBar.NoResults' })}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default ExploreBar
