import React from 'react'

import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import {
  Flex, Box,
  Button,
  Input,
  Select,
  Label,
  RadioGroup,
  RadioButton
} from 'ooni-components'
import moment from 'moment'

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

    // Display `${today}` as the end date for default search
    const today = moment().format('YYYY-MM-DD')

    this.state = {
      domainFilter: props.domainFilter || '',
      onlyFilter: props.onlyFilter || 'all',
      testNameFilter: props.testNameFilter || 'XX',
      countryFilter: props.countryFilter || '',
      asnFilter: props.asnFilter || '',
      sinceFilter: props.sinceFilter || '',
      untilFilter: props.untilFilter || today,
      showSinceCalendar: true,
      showUntilCalendar: false,
      isFilterDirty: false,
      asnError: false,
      domainError: false,
      showDomain: this.showDomainField(props.testNameFilter || 'XX')
    }

    this.getStateForFilterChange = this.getStateForFilterChange.bind(this)
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onDateChangeFilter = this.onDateChangeFilter.bind(this)
    this.onClickApplyFilter = this.onClickApplyFilter.bind(this)
    this.isSinceValid = this.isSinceValid.bind(this)
    this.isUntilValid = this.isUntilValid.bind(this)
  }

  showDomainField(testName) {
    const testsWithValidDomain = [
      'XX', // We show the field by default (state initialized to 'XX')
      'web_connectivity',
      'http_requests',
      'dns_consistency',
      'tcp_connect'
    ]

    // Should domain filter be shown for `testsWithValidDomain`?
    return testsWithValidDomain.indexOf(testName) > -1
  }

  getStateForFilterChange (filterName, newValue) {
    const newState = {}
    // Calculate changes when test name changes
    if (filterName === 'testNameFilter') {
      const isTestWithValidDomain = this.showDomainField(newValue)
      newState['showDomain'] = isTestWithValidDomain

      // If not, then blank out the `domain` parameter to avoid bad queries
      if (!isTestWithValidDomain) {
        newState['domainFilter'] = ''
      }
    }

    // In future, calculate changes when country changes
    // if (filterName === 'countryFilter') {}

    return newState
  }

  onChangeFilter (filterName) {
    return ((e) => {
      // Get updates to state based on test name change
      const stateChangesByTestName = this.getStateForFilterChange(filterName, e.target.value)
      // Input Validations
      switch(filterName) {
      case 'asnFilter':
        var asnValue = e.target.value
        var asnRegEx = /^(^AS|as)?[0-9]+$/
        if (asnValue && asnValue.match(asnRegEx) === null) {
          this.setState({
            asnError: 'Valid formats: AS1234, 1234',
            [filterName]: e.target.value,
            isFilterDirty: false
          })
          return
        } else {
          this.setState({
            asnError: false
          })
        }
        break
      }

      this.setState({
        [filterName]: e.target.value,
        isFilterDirty: true,
        ...stateChangesByTestName
      })
    }).bind(this)
  }

  onDateChangeFilter (filterName) {
    return ((date) => {
      this.setState({
        [filterName]: (date !== '') ? date.utc().format('YYYY-MM-DD') : date,
        isFilterDirty: true
      })
    })
  }

  onRadioChangeFilter (filterName) {
    return ((value) => {
      this.setState({
        [filterName]: value,
        isFilterDirty: true
      })
    })
  }

  isSinceValid(currentDate) {
    const { untilFilter } = this.state
    if (untilFilter.length !== 0) {
      return currentDate.isBefore(untilFilter)
    } else {
      return currentDate.isSameOrBefore(new Date())
    }
  }

  isUntilValid(currentDate) {
    const { sinceFilter } = this.state
    if (sinceFilter.length !== 0) {
      return currentDate.isAfter(sinceFilter) && currentDate.isSameOrBefore(new Date())
    } else {
      return currentDate.isSameOrBefore(new Date())
    }
  }

  onClickApplyFilter() {
    this.props.onApplyFilter({
      domainFilter: this.state.domainFilter,
      onlyFilter: this.state.onlyFilter,
      testNameFilter: this.state.testNameFilter,
      countryFilter: this.state.countryFilter,
      asnFilter: this.state.asnFilter,
      sinceFilter: this.state.sinceFilter,
      untilFilter: this.state.untilFilter
    })
    this.setState({
      isFilterDirty: false
    })
  }

  render() {
    const {
      testNames,
      countries,
      intl
    } = this.props

    const {
      showDomain,
      domainFilter,
      onlyFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter,
      isFilterDirty,
      asnError,
      domainError
    } = this.state

    //Insert an 'Any' option to test name filter
    const testNameOptions = [...testNames]
    testNameOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'}), id: 'XX'})

    const countryOptions = [...countries]
    countryOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.Country.AllCountries'}), alpha_2: 'XX'})

    return (
      <StyledFilterSidebar>
        <SelectWithLabel
          pt={2}
          label={intl.formatMessage({id: 'Search.Sidebar.TestName'})}
          value={testNameFilter}
          onChange={this.onChangeFilter('testNameFilter')}>
          {testNameOptions.map((v, idx) => {
            return (
              <option key={idx} value={v.id}>{v.name}</option>
            )
          })}
        </SelectWithLabel>

        {
          showDomain &&
          <InputWithLabel
            label={intl.formatMessage({id: 'Search.Sidebar.Input'})}
            name="domainFilter"
            value={domainFilter}
            error={domainError}
            onChange={this.onChangeFilter('domainFilter')}
            placeholder={intl.formatMessage({id: 'Search.Sidebar.Input.Placeholder'})}
            type="text"
          />
        }

        <StyledLabel>
          {intl.formatMessage({id: 'Search.Sidebar.Status'})}
        </StyledLabel>
        <RadioGroup
          onChange={this.onRadioChangeFilter('onlyFilter')}
          value={onlyFilter}
        >
          <RadioButton
            label={intl.formatMessage({id: 'Search.FilterButton.AllResults'}) }
            value='all'
            checked={onlyFilter === 'all'}
          />
          <RadioButton
            label={intl.formatMessage({id: 'Search.FilterButton.Confirmed'}) }
            value='confirmed'
          />
          <RadioButton
            label={intl.formatMessage({id: 'Search.FilterButton.Anomalies'}) }
            value='anomalies'
          />
        </RadioGroup>

        <SelectWithLabel
          pt={2}
          label={intl.formatMessage({id: 'Search.Sidebar.Country'})}
          value={countryFilter}
          name="countryFilter"
          onChange={this.onChangeFilter('countryFilter')}>
          {countryOptions.map((v, idx) => {
            return (
              <option key={idx} value={v.alpha_2}>{v.name}</option>
            )
          })}
        </SelectWithLabel>

        <InputWithLabel
          label={intl.formatMessage({id: 'Search.Sidebar.ASN'})}
          value={asnFilter}
          error={asnError}
          name="asnFilter"
          onChange={this.onChangeFilter('asnFilter')}
          placeholder={intl.formatMessage({id: 'Search.Sidebar.ASN.example'})}
        />

        <Flex>
          <Box width={1/2} pr={1}>
            <StyledLabel>
              {intl.formatMessage({id: 'Search.Sidebar.From'})}
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
              {intl.formatMessage({id: 'Search.Sidebar.Until'})}
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
          onClick={this.onClickApplyFilter}
          disabled={!isFilterDirty}
        >
          {intl.formatMessage({id: 'Search.Sidebar.Button.FilterResults'})}
        </Button>
      </StyledFilterSidebar>
    )
  }
}

export default injectIntl(FilterSidebar)
