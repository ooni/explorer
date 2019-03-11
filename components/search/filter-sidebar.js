import React from 'react'

import styled from 'styled-components'

import {
  Flex, Box,
  Button,
  Input,
  Select,
  Label,
} from 'ooni-components'

import DatePicker from '../date-picker'

const StyledInputWithLabel = styled.div``
const StyledLabel = styled(Label)`
  color: ${props => props.theme.colors.blue5};
  padding-top: 32px;
`
const InputWithLabel = (props) => (
  <StyledInputWithLabel>
    <StyledLabel>
      {props.label}
    </StyledLabel>
    <Input {...props} />
  </StyledInputWithLabel>
)

const StyledSelectWithLabel = styled.div``

const SelectWithLabel = (props) => (
  <StyledSelectWithLabel>
    <StyledLabel>
      {props.label}
    </StyledLabel>
    <Select {...props} style={{width: '100%'}}>
      {props.children}
    </Select>
  </StyledSelectWithLabel>
)

const StyledFilterSidebar = styled.div`
`

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputFilter: props.inputFilter || '',
      testNameFilter: props.testNameFilter || '',
      countryFilter: props.countryFilter || '',
      asnFilter: props.asnFilter || '',
      sinceFilter: props.sinceFilter || '',
      untilFilter: props.untilFilter || '',
      showSinceCalendar: true,
      showUntilCalendar: false,
    }
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onDateChangeFilter = this.onDateChangeFilter.bind(this)
    this.onClickApplyFilter = this.onClickApplyFilter.bind(this)
    this.isSinceValid = this.isSinceValid.bind(this)
    this.isUntilValid = this.isUntilValid.bind(this)
  }

  onChangeFilter (filterName) {
    return ((e) => {
      this.setState({[filterName]: e.target.value})
    }).bind(this)
  }

  onDateChangeFilter (filterName) {
    return ((date) => {
      this.setState({[filterName]: date.utc().format('YYYY-MM-DD')})
    })
  }

  isSinceValid(currentDate) {
    const { untilFilter } = this.state
    return currentDate.isBefore(untilFilter)
  }

  isUntilValid(currentDate) {
    const { sinceFilter } = this.state
    return currentDate.isAfter(sinceFilter) && currentDate.isSameOrBefore(new Date())
  }

  onClickApplyFilter() {
    this.props.onApplyFilter({
      inputFilter: this.state.inputFilter,
      testNameFilter: this.state.testNameFilter,
      countryFilter: this.state.countryFilter,
      asnFilter: this.state.asnFilter,
      sinceFilter: this.state.sinceFilter,
      untilFilter: this.state.untilFilter,
    })
  }

  render() {
    const {
      testNames,
      countries
    } = this.props

    const {
      inputFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter
    } = this.state
    return (
      <StyledFilterSidebar>
        <InputWithLabel
          label="Input"
          name="inputFilter"
          value={inputFilter}
          onChange={this.onChangeFilter('inputFilter')}
          placeholder="ex. torproject.org"
          type="text" />
        <SelectWithLabel
          pt={2}
          label="Test Name"
          value={testNameFilter}
          onChange={this.onChangeFilter('testNameFilter')}>
          {testNames.map((v, idx) => {
            return (
              <option key={idx} value={v.id}>{v.name}</option>
            )
          })}
        </SelectWithLabel>

        <SelectWithLabel
          pt={2}
          label="Country"
          value={countryFilter}
          name="countryFilter"
          onChange={this.onChangeFilter('countryFilter')}>
          {countries.map((v, idx) => {
            return (
              <option key={idx} value={v.alpha_2}>{v.name}</option>
            )
          })}
        </SelectWithLabel>

        <InputWithLabel
          label="ASN"
          value={asnFilter}
          name="asnFilter"
          onChange={this.onChangeFilter('asnFilter')} />

        <Flex>
          <Box width={1/2} pr={1}>
            <StyledLabel>
        Since
            </StyledLabel>
            <DatePicker
              value={sinceFilter}
              onChange={this.onDateChangeFilter('sinceFilter')}
              timeFormat={false}
              isValidDate={this.isSinceValid}
            />
          </Box>
          <Box width={1/2} pl={1}>
            <StyledLabel>
        Until
            </StyledLabel>
            <DatePicker
              value={untilFilter}
              onChange={this.onDateChangeFilter('untilFilter')}
              timeFormat={false}
              isValidDate={this.isUntilValid}
            />
          </Box>
        </Flex>
        <Button
          mt={3}
          onClick={this.onClickApplyFilter}>
        Filter Results
        </Button>
      </StyledFilterSidebar>
    )
  }
}

export default FilterSidebar
