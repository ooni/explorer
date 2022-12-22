import React, { useState } from 'react'
import { format, parse, sub, addDays } from 'date-fns'
import { DayPicker, useInput } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Button } from 'ooni-components'
import { getDirection } from 'components/withIntl'

import de from 'date-fns/locale/de'
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import fa from 'date-fns/locale/fa-IR'
import fr from 'date-fns/locale/fr'
import is from 'date-fns/locale/is'
import ru from 'date-fns/locale/ru'
import tr from 'date-fns/locale/tr'
import zh from 'date-fns/locale/zh-CN'

const StyledDatetime = styled.div`
z-index: 99999;
position: absolute;
max-width: 300px;
background-color: #ffffff;
border: 1px solid ${props => props.theme.colors.gray2};

.rdp-cell {
  padding: 2px 0;
}

.rdp-day_selected:not([disabled]),
.rdp-day_selected:focus:not([disabled]),
.rdp-day_selected:active:not([disabled]),
.rdp-day_selected:hover:not([disabled]) {
  background-color: ${props => props.theme.colors.blue5};
}
`

const StyledRangeButtons = styled.div`
margin: 1em 1em 0;
display: flex;
gap: 6px;
flex-wrap: wrap;
button {
  padding: 4px 6px;
}
`

const StyledFooter = styled.div`
display: flex;
justify-content: right;
gap: 6px;
`

const getDateFnsLocale = locale => {
  switch (locale) {
    case 'de':
      return de
    case 'es':
      return es
    case 'fa':
      return fa
    case 'fr':
      return fr
    case 'is':
      return is
    case 'ru':
      return ru
    case 'tr':
      return tr
    case 'zh':
      return zh
    default:
      return en
  }
}

const DateRangePicker = ({handleRangeSelect, initialRange, close, ...props}) => {
  const intl = useIntl()
  const ranges = ['Today', 'LastWeek', 'LastMonth', 'LastYear']
  
  const selectRange = (range) => {
    switch (range) {
      case 'Today':
        handleRangeSelect({from: new Date(), to: new Date()})
        break
      case 'LastWeek':
        handleRangeSelect({from: sub(new Date(), {weeks: 1}) , to: new Date()})
        break
      case 'LastMonth':
        handleRangeSelect({from: sub(new Date(), {months: 1}) , to: new Date()})
        break
      case 'LastYear':
        handleRangeSelect({from: sub(new Date(), {years: 1}) , to: new Date()})
        break
    }
  }

  const rangesList = ranges.map((range) => 
    <Button
      hollow
      key={range}
      onClick={(e) => {
        e.preventDefault()
        selectRange(range)
      }}>{intl.formatMessage({id: `DateRange.${range}`})}</Button>
  )
  const [range, setRange] = useState({from: parse(initialRange.from, 'yyyy-MM-dd', new Date()), to: parse(initialRange.to, 'yyyy-MM-dd', new Date())})
  const Footer = () => (
    <StyledFooter>
      <Button id='apply-range' onClick={(e) => {
        e.preventDefault()
        handleRangeSelect(range)}
        }>{intl.formatMessage({id: 'DateRange.Apply'})}</Button>
      <Button
        hollow
        onClick={(e) => {
          e.preventDefault()
          close()}
        }>{intl.formatMessage({id: 'DateRange.Cancel'})}</Button>
    </StyledFooter>
  )
  const onSelect = (range) => {
    setRange(range)
  }

  const tomorrow = addDays(new Date(), 1)

  return (
    <StyledDatetime>
      <OutsideClickHandler onOutsideClick={() => close()}>
        <StyledRangeButtons>{rangesList}</StyledRangeButtons>
        <DayPicker 
          {...props}
          dir={getDirection(intl.locale)}
          locale={getDateFnsLocale(intl.locale)}
          mode="range"
          toDate={tomorrow}
          selected={range}
          onSelect={onSelect}
          footer={<Footer/>} />
      </OutsideClickHandler>
    </StyledDatetime>
  )
}

export default DateRangePicker