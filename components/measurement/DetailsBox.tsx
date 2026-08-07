import { useCallback, useRef, useState, type ReactNode } from 'react'
import { MdExpandLess } from 'react-icons/md'
import useSWR, { type Fetcher, type Key, type SWRConfiguration } from 'swr'
import { twMerge } from 'tailwind-merge'
import SpinLoader from 'components/vendor/SpinLoader'

type DetailsBoxProps = {
  title?: ReactNode
  content?: ReactNode
  collapsed?: boolean
  children?: ReactNode
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content' | 'children'>

export const DetailsBox = ({
  title,
  content,
  collapsed = false,
  children,
  className,
  ...rest
}: DetailsBoxProps) => {
  const [isOpen, setIsOpen] = useState(!collapsed)

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <div
      className={twMerge('border-2 border-gray-200 w-full my-8', className)}
      {...rest}
    >
      {title && (
        <div
          className="flex justify-between font-bold text-lg cursor-pointer px-4 py-2 bg-gray-200 items-center"
          onClick={onToggle}
        >
          {title}
          <MdExpandLess
            className={`cursor-pointer bg-white rounded-[50%] transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            size={36}
          />
        </div>
      )}
      <div
        className={twMerge(
          'p-4 flex-wrap overflow-x-auto text-sm',
          isOpen ? 'block' : 'hidden',
        )}
      >
        {content || children}
      </div>
    </div>
  )
}

type DetailsBoxTableItem = {
  label: string
  value?: ReactNode
}

type DetailsBoxTableProps = {
  title?: ReactNode
  items: DetailsBoxTableItem[]
  className?: string
}

export const DetailsBoxTable = ({
  title,
  items,
  className,
}: DetailsBoxTableProps) => (
  <DetailsBox
    title={title}
    className={className}
    content={items.map((item, index) => (
      <div className="flex flex-wrap" key={index}>
        <div className="md:w-1/4 font-bold pe-4">{item.label}</div>
        <div className="md:w-3/4 wrap-break-word">{item.value}</div>
      </div>
    ))}
  />
)

type LazyDetailsBoxProps<Data = unknown, SWRKey extends Key = Key> = {
  title?: ReactNode
  swrKey: SWRKey
  fetcher: Fetcher<Data, SWRKey>
  children: (data: Data) => ReactNode
  className?: string
  swrOptions?: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>>
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content' | 'children'>

/**
 * Collapsed by default. Fetches via SWR only after the first expand; cached
 * data is kept when the box is closed and reopened.
 * `children` is a render function `(data) => node`.
 */
export const LazyDetailsBox = <Data, SWRKey extends Key = Key>({
  title,
  swrKey,
  fetcher,
  className,
  swrOptions,
  children,
  ...rest
}: LazyDetailsBoxProps<Data, SWRKey>) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasOpenedRef = useRef(false)

  const { data, error, isLoading } = useSWR(
    hasOpenedRef.current ? swrKey : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...swrOptions,
    },
  )

  const onToggle = useCallback(() => {
    hasOpenedRef.current = true
    setIsOpen((open) => !open)
  }, [])

  return (
    <div
      className={twMerge('border-2 border-gray-200 w-full my-8', className)}
      {...rest}
    >
      {title && (
        <div
          className="flex justify-between font-bold text-lg cursor-pointer px-4 py-2 bg-gray-200 items-center"
          onClick={onToggle}
        >
          {title}
          <MdExpandLess
            className={`cursor-pointer bg-white rounded-[50%] transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            size={36}
          />
        </div>
      )}
      <div
        className={twMerge(
          'p-4 flex-wrap overflow-x-auto text-sm',
          isOpen ? 'block' : 'hidden',
        )}
      >
        {isLoading && (
          <div className="flex justify-center py-4">
            <SpinLoader />
          </div>
        )}
        {error && <div>{error.message || 'Failed to load content'}</div>}
        {!isLoading && !error && data != null && children(data)}
      </div>
    </div>
  )
}
