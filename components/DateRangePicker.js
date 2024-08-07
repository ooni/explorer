import { addDays, parse, sub } from 'date-fns'
import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { useIntl } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'

import ar from 'date-fns/locale/ar'
import de from 'date-fns/locale/de'
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import fa from 'date-fns/locale/fa-IR'
import fr from 'date-fns/locale/fr'
import is from 'date-fns/locale/is'
import pt from 'date-fns/locale/pt'
import ru from 'date-fns/locale/ru'
import th from 'date-fns/locale/th'
import tr from 'date-fns/locale/tr'
import vi from 'date-fns/locale/vi'
import zh from 'date-fns/locale/zh-CN'
import zhHant from 'date-fns/locale/zh-HK'

import { getDirection } from 'components/withIntl'

const Footer = ({ handleRangeSelect, range, close }) => {
  const intl = useIntl()

  return (
    <div className="flex justify-end gap-1">
      <button
        className="btn btn-primary"
        type="button"
        id="apply-range"
        onClick={(e) => {
          e.preventDefault()
          handleRangeSelect(range)
        }}
      >
        {intl.formatMessage({ id: 'DateRange.Apply' })}
      </button>
      <button
        className="btn btn-primary-hollow"
        type="button"
        onClick={(e) => {
          e.preventDefault()
          close()
        }}
      >
        {intl.formatMessage({ id: 'DateRange.Cancel' })}
      </button>
    </div>
  )
}

const DateRangePicker = ({
  handleRangeSelect,
  initialRange,
  close,
  ...props
}) => {
  const intl = useIntl()
  const tomorrow = addDays(new Date(), 1)
  const ranges = ['Today', 'LastWeek', 'LastMonth', 'LastYear']

  const dateFnsLocale = useMemo(() => {
    switch (intl.locale) {
      case 'de':
        return de
      case 'es':
        return es
      case 'fa':
        return fa
      case 'ar':
        return ar
      case 'fr':
        return fr
      case 'is':
        return is
      case 'pt-BR':
        return pt
      case 'ru':
        return ru
      case 'tr':
        return tr
      case 'th':
        return th
      case 'vi':
        return vi
      case 'zh-CN':
        return zh
      case 'zh-Hant':
        return zhHant
      default:
        return en
    }
  }, [intl.locale])

  const selectRange = (range) => {
    switch (range) {
      case 'Today':
        handleRangeSelect({ from: new Date(), to: tomorrow })
        break
      case 'LastWeek':
        handleRangeSelect({ from: sub(new Date(), { weeks: 1 }), to: tomorrow })
        break
      case 'LastMonth':
        handleRangeSelect({
          from: sub(new Date(), { months: 1 }),
          to: tomorrow,
        })
        break
      case 'LastYear':
        handleRangeSelect({ from: sub(new Date(), { years: 1 }), to: tomorrow })
        break
    }
  }

  const rangesList = ranges.map((range) => (
    <button
      className="btn btn-primary-hollow btn-sm px-2"
      type="button"
      key={range}
      onClick={(e) => {
        e.preventDefault()
        selectRange(range)
      }}
    >
      {intl.formatMessage({ id: `DateRange.${range}` })}
    </button>
  ))
  const [range, setRange] = useState({
    from: parse(initialRange.from, 'yyyy-MM-dd', new Date()),
    to: parse(initialRange.to, 'yyyy-MM-dd', new Date()),
  })

  const onSelect = (range) => {
    setRange(range)
  }

  return (
    <div className="z-[6666] absolute max-w-[300px] bg-white border border-gray-200">
      <OutsideClickHandler onOutsideClick={() => close()}>
        <div className="flex gap-1 mt-2 mx-2 mb-0 flex-wrap">{rangesList}</div>
        <DayPicker
          {...props}
          dir={getDirection(intl.locale)}
          locale={dateFnsLocale}
          mode="range"
          toDate={tomorrow}
          selected={range}
          onSelect={onSelect}
          classNames={{
            vhidden: 'sr-only',
            caption: 'flex justify-center items-center h-10',
            root: 'text-gray-800',
            months: 'flex gap-4 relative px-4',
            caption_label: 'text-xl px-1',
            nav_button:
              'inline-flex justify-center items-center absolute top-0 w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100',
            nav_button_next: 'right-0',
            nav_button_previous: 'left-0',
            table: 'border-collapse border-spacing-0',
            head_cell: 'w-10 h-10 uppercase align-middle text-center',
            cell: 'w-10 h-10 align-middle text-center border-0 px-0',
            day: 'rounded-full w-10 h-10 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-50 active:bg-blue-600 active:text-white',
            day_selected: 'text-white bg-blue-500 hover:bg-blue-500',
            day_today: 'font-bold',
            day_disabled:
              'opacity-25 hover:bg-white active:bg-white active:text-gray-800',
            day_outside: 'enabled:opacity-50',
            day_range_middle: 'rounded-none',
            day_range_end: 'rounded-l-none rounded-r-full',
            day_range_start: 'rounded-r-none rounded-l-full',
            day_hidden: 'hidden',
          }}
          footer={
            <Footer
              handleRangeSelect={handleRangeSelect}
              close={close}
              range={range}
            />
          }
        />
      </OutsideClickHandler>
    </div>
  )
}

export default DateRangePicker
