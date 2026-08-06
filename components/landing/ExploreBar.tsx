import axios from 'axios'
import countries from 'data/countries.json'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const MAX_LOCAL_MATCHES = 5
const MAX_TOTAL_RESULTS = 15
const DEFAULT_COUNTRY_COUNT = 2
const DEFAULT_NETWORK_COUNT = 3
const DEFAULT_DOMAIN_COUNT = 3
const TOP_COUNTRY_POOL = 20

const TOP_COUNTRIES = [...countries]
  .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  .slice(0, TOP_COUNTRY_POOL)

interface SearchResult {
  type: 'country' | 'network' | 'domain' | 'theme'
  key: string | number
  name: string
  href: string
  intlId?: string
}

interface LocalOption extends SearchResult {
  haystack: string
}

// Countries and themes are matched client-side against localized names
// (the API only searches domains and networks). English aliases keep
// English queries working in every locale.
const THEME_OPTIONS = [
  {
    key: 'social-media',
    intlId: 'Navbar.SocialMedia',
    name: 'Social media',
    aliases: 'social media facebook twitter instagram whatsapp telegram',
  },
  {
    key: 'news-media',
    intlId: 'Navbar.NewsMedia',
    name: 'News media',
    aliases: 'news media press journalism',
  },
  {
    key: 'circumvention',
    intlId: 'Navbar.Circumvention',
    name: 'Circumvention tools',
    aliases: 'circumvention tools vpn tor psiphon proxy',
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

const pickRandom = <T,>(items: T[], count: number): T[] =>
  shuffle(items).slice(0, count)

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

  const { data: defaultPool, isLoading: isDefaultLoading } =
    useSWR<SearchResult[]>(hasOpened ? '/api/search' : null, fetcher, {
      revalidateOnFocus: false,
    })

  const trimmedQuery = query.trim()
  const { data: searchResults, isLoading: isSearchLoading } =
    useSWR<SearchResult[]>(
      hasOpened && trimmedQuery ? ['/api/search', { q: trimmedQuery }] : null,
      fetcher,
      { revalidateOnFocus: false, keepPreviousData: true },
    )

  const { themeOptions, countryOptions, localOptions } = useMemo(() => {
    const lower = (value: string) => value.toLocaleLowerCase(intl.locale)
    const themeOptions = THEME_OPTIONS.map(({ key, intlId, name, aliases }) => {
      const localizedLabel = intl.formatMessage({
        id: intlId,
        defaultMessage: name,
      })
      return {
        type: 'theme' as const,
        key,
        name,
        intlId,
        href: `/${key}`,
        haystack: `${lower(localizedLabel)} ${aliases}`,
      }
    })
    const toCountryOption = ({ alpha_2, name }: { alpha_2: string; name: string }) => ({
      type: 'country' as const,
      key: alpha_2,
      name,
      href: `/country/${alpha_2}`,
      haystack: lower(
        `${getLocalisedRegionName(alpha_2, intl.locale)} ${name} ${alpha_2}`,
      ),
    })
    const countryOptions = TOP_COUNTRIES.map(toCountryOption)
    return {
      themeOptions,
      countryOptions,
      localOptions: [...themeOptions, ...countries.map(toCountryOption)],
    }
  }, [intl])

  const defaultSuggestions = useMemo(() => {
    if (!defaultPool) return []

    const networks = defaultPool.filter((o) => o.type === 'network')
    const domains = defaultPool.filter((o) => o.type === 'domain')

    return [
      ...themeOptions,
      ...pickRandom(countryOptions, DEFAULT_COUNTRY_COUNT),
      ...pickRandom(networks, DEFAULT_NETWORK_COUNT),
      ...pickRandom(domains, DEFAULT_DOMAIN_COUNT),
    ]
  }, [defaultPool, themeOptions, countryOptions])

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

  // Show a loader only when there is nothing to display yet and a request
  // is in flight (initial default load, or a first search with no matches)
  const isLoading =
    options.length === 0 &&
    (trimmedInput ? isSearchLoading : isDefaultLoading)

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
      case 'theme':
        return intl.formatMessage({
          id: option.intlId ?? option.name,
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
          onBlur={() => setIsOpen(false)}
        />
      </div>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-2 w-full max-h-100 overflow-y-auto rounded-lg bg-white my-2 text-left text-blue-900 shadow-lg px-0"
        >
          {isLoading && (
            <>
              <li className="sr-only" role="status">
                {intl.formatMessage({ id: 'Home.ExploreBar.Loading' })}
              </li>
              {Array.from({ length: 4 }).map((_, i) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
                  key={`skeleton-${i}`}
                  aria-hidden="true"
                  className="flex items-center gap-3 px-2 py-2"
                >
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="ml-auto h-3 w-14 animate-pulse rounded bg-gray-200" />
                </li>
              ))}
            </>
          )}
          {!isLoading &&
            options.map((option, index) => (
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
          {!isLoading && options.length === 0 && (
            <li className="px-5 py-2 text-gray-500" aria-hidden="true">
              {intl.formatMessage({ id: 'Home.ExploreBar.NoResults' })}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default ExploreBar
