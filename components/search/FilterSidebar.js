import React from 'react'

import styled from 'styled-components'
import { injectIntl, useIntl } from 'react-intl'
import {
  Flex, Box,
  Button,
  Input,
  Select,
  Label,
} from 'ooni-components'
import moment from 'moment'

import DatePicker from '../DatePicker'
import {
  RadioGroup,
  RadioButton
} from './Radio'
import { testGroups, testNames as testNamesIntl } from '../test-info'

const StyledInputWithLabel = styled.div``
const StyledLabel = styled(Label).attrs({
  mb: 1,
  fontSize: 1
})`
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

const TestNameOptions = ({testNames}) => {
  const intl = useIntl()

  // console.log(testNames)
  const groupedTestNameOptions = testNames
    .reduce((grouped, test) => {
      const group = test.id in testNamesIntl ? testNamesIntl[test.id].group : 'legacy'
      const option = {
        id: test.id,
        name: test.name,
        group
      }
      if (group in grouped) {
        grouped[group].push(option)
      } else {
        grouped[group] = [option]
      }
      return grouped
    }, {})

  const sortedGroupedTestNameOptions = new Map()

  for (const group of Object.keys(testGroups).values()) {
    if (group in groupedTestNameOptions) {
      sortedGroupedTestNameOptions.set(group, groupedTestNameOptions[group])
    }
  }

  return ([
    // Insert an 'Any' option to test name filter
    <option key='XX' value='XX'>{intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'})}</option>,
    [...sortedGroupedTestNameOptions].map(([group, tests]) => {
      const groupName = group in testGroups ? intl.formatMessage({id: testGroups[group].id}) : group
      const testOptions = tests.map(({id, name}) => (
        <option key={id} value={id}>{name}</option>
      ))
      return [<optgroup key={group} label={groupName} />, ...testOptions]
    })
  ])
}

const testsWithValidDomain = [
  'XX', // We show the field by default (state initialized to 'XX')
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect'
]

const testsWithAnomalyStatus = [
  'XX', // If 'Any' is selected, we still show the filter
  'web_connectivity',
  'telegram',
  'facebook_messenger',
  'whatsapp',
  'signal',
  'http_header_field_manipulation',
  'http_invalid_request_line',
  'psiphon',
  'tor',
]

const testsWithConfirmedStatus = [
  'XX',
  'web_connectivity'
]

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)

    // Display `${tomorrow}` as the end date for default search
    // to include the measurements of `${today}` as well.
    const tomorrowUTC = moment.utc().add(1, 'day').format('YYYY-MM-DD')

    this.state = {
      domainFilter: props.domainFilter || '',
      onlyFilter: props.onlyFilter || 'all',
      testNameFilter: props.testNameFilter || 'XX',
      countryFilter: props.countryFilter || '',
      asnFilter: props.asnFilter || '',
      sinceFilter: props.sinceFilter || '',
      untilFilter: props.untilFilter || tomorrowUTC,
      showSinceCalendar: true,
      showUntilCalendar: false,
      isFilterDirty: false,
      asnError: false,
      domainError: false,
      showDomain: this.isValidFilterForTestname(props?.testNameFilter, testsWithValidDomain),
      showAnomalyFilter: this.isValidFilterForTestname(props?.testNameFilter, testsWithAnomalyStatus),
      showConfirmedFilter: this.isValidFilterForTestname(props?.testNameFilter, testsWithConfirmedStatus)
    }

    this.getStateForFilterChange = this.getStateForFilterChange.bind(this)
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onDateChangeFilter = this.onDateChangeFilter.bind(this)
    this.onClickApplyFilter = this.onClickApplyFilter.bind(this)
    this.isSinceValid = this.isSinceValid.bind(this)
    this.isUntilValid = this.isUntilValid.bind(this)
  }

  isValidFilterForTestname(testName = 'XX', arrayWithMapping) {
    // Should domain filter be shown for `testsWithValidDomain`?
    return arrayWithMapping.includes(testName)
  }

  getStateForFilterChange (filterName, newValue) {
    const newState = {}
    // Calculate changes when test name changes
    if (filterName === 'testNameFilter') {
      const isTestWithValidDomain = this.isValidFilterForTestname(newValue, testsWithValidDomain)
      newState['showDomain'] = isTestWithValidDomain

      // If not, then blank out the `domain` parameter to avoid bad queries
      if (!isTestWithValidDomain) {
        newState['domainFilter'] = ''
      }

      // Can we filter out anomalies or confirmed for this test_name
      const showAnomalyFilter = this.isValidFilterForTestname(newValue, testsWithAnomalyStatus)
      const showConfirmedFilter = this.isValidFilterForTestname(newValue, testsWithConfirmedStatus)
      newState['showAnomalyFilter'] = showAnomalyFilter
      newState['showConfirmedFilter'] = showConfirmedFilter

      // Reset status filter to 'all' if selected state isn't relevant
      // e.g 'anomalies' for 'NDT', 'confirmed' for 'telegram'
      if ((!showAnomalyFilter && this.state.onlyFilter === 'anomalies')) {
        newState['onlyFilter'] = 'all'
      } else if (!showConfirmedFilter && this.state.onlyFilter === 'confirmed') {
        newState['onlyFilter'] = 'all'
      }
    }

    return newState
  }

  onChangeFilter (filterName) {
    return ((e) => {
      const { intl } = this.props
      // Get updates to state based on test name change
      let stateChanges = this.getStateForFilterChange(filterName, e.target.value)
      // Input Validations
      switch(filterName) {
      case 'asnFilter':
        var asnValue = e.target.value
        // Accepts only formats like AS1234 or 1234
        // https://regex101.com/r/DnkspD/latest
        var asnRegEx = /^(AS)?([1-9][0-9]*)$/
        if (
          typeof asnValue === 'string' &&
          (asnValue === '' || asnValue.match(asnRegEx) !== null)
        ) {
          stateChanges = {...stateChanges,
            asnError: false,
            isFilterDirty: true
          }
        } else {
          stateChanges = {...stateChanges,
            asnError: intl.formatMessage({id: 'Search.Sidebar.ASN.Error'}),
            isFilterDirty: false
          }
        }
        break
      case 'domainFilter':
        var domainValue = e.target.value
        // eslint-disable-next-line no-useless-escape
        var domainRegEx = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,5})?(\/)?$/
        var ipRegEx = /^(([0-9]{1,3})\.){3}([0-9]{1,3})/
        if (domainValue && domainValue.match(domainRegEx) === null
        && domainValue.match(ipRegEx) === null) {
          stateChanges = {...stateChanges,
            domainError: intl.formatMessage({id: 'Search.Sidebar.Domain.Error'}),
            isFilterDirty: false
          }
        } else {
          stateChanges = {...stateChanges,
            domainError: false,
            isFilterDirty: true
          }
        }
        break

      default:
        stateChanges = {...stateChanges,
          isFilterDirty: true
        }
      }

      this.setState({
        [filterName]: e.target.value,
        ...stateChanges
      })
    }).bind(this)
  }

  onDateChangeFilter (filterName) {
    return ((date) => {
      if (moment.utc(new Date(date)).isValid() || date === '') {
        const newDate = moment.isMoment(date) ? date.format('YYYY-MM-DD') : date
        this.setState({
          [filterName]: newDate,
          isFilterDirty: true
        })
      } else {
        this.setState({
          [filterName]: date,
          isFilterDirty: false
        })
      }
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
    // Valid dates for start of date range
    // 1. Before the end of date range (untilFilter), if provided
    // 2. Until tomorrow
    const tomorrow = moment.utc().add(1, 'day')
    const { untilFilter } = this.state
    if (untilFilter.length !== 0) {
      return currentDate.isBefore(untilFilter)
    } else {
      return currentDate.isSameOrBefore(tomorrow)
    }
  }

  isUntilValid(currentDate) {
    const tomorrow = moment.utc().add(1, 'day')
    const { sinceFilter } = this.state
    if (sinceFilter.length !== 0) {
      return currentDate.isAfter(sinceFilter) && currentDate.isSameOrBefore(tomorrow)
    } else {
      return currentDate.isSameOrBefore(tomorrow)
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
      showAnomalyFilter,
      showConfirmedFilter,
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
    // testNameOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'}), id: 'XX'})

    const countryOptions = [...countries]
    countryOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.Country.AllCountries'}), alpha_2: 'XX'})

    return (
      <StyledFilterSidebar>
        <SelectWithLabel
          pt={2}
          label={intl.formatMessage({id: 'Search.Sidebar.Country'})}
          value={countryFilter}
          name="countryFilter"
          data-test-id='country-filter'
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
          data-test-id='asn-filter'
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
              dateFormat='YYYY-MM-DD'
              utc={true}
              timeFormat={false}
              isValidDate={this.isSinceValid}
              inputProps={{id: 'since-filter'}}
            />
          </Box>
          <Box width={1/2} pl={1}>
            <StyledLabel>
              {intl.formatMessage({id: 'Search.Sidebar.Until'})}
            </StyledLabel>
            <DatePicker
              value={untilFilter}
              onChange={this.onDateChangeFilter('untilFilter')}
              dateFormat='YYYY-MM-DD'
              utc={true}
              timeFormat={false}
              isValidDate={this.isUntilValid}
              inputProps={{id: 'until-filter'}}
            />
          </Box>
        </Flex>

        <SelectWithLabel
          pt={2}
          label={intl.formatMessage({id: 'Search.Sidebar.TestName'})}
          name='testNameFilter'
          data-test-id='testname-filter'
          value={testNameFilter}
          onChange={this.onChangeFilter('testNameFilter')}
        >
          <TestNameOptions testNames={testNames} />
        </SelectWithLabel>

        {
          showDomain &&
          <InputWithLabel
            label={intl.formatMessage({id: 'Search.Sidebar.Domain'})}
            name='domainFilter'
            data-test-id='domain-filter'
            value={domainFilter}
            error={domainError}
            onChange={this.onChangeFilter('domainFilter')}
            placeholder={intl.formatMessage({id: 'Search.Sidebar.Domain.Placeholder'})}
            type="text"
          />
        }

        {(showConfirmedFilter || showAnomalyFilter) && (<>
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
            />
            {showConfirmedFilter ? (
              <RadioButton
                label={intl.formatMessage({id: 'Search.FilterButton.Confirmed'}) }
                value='confirmed'
              />
            ) : <div/>}
            {showAnomalyFilter ? (
              <RadioButton
                label={intl.formatMessage({id: 'Search.FilterButton.Anomalies'}) }
                value='anomalies'
              />
            ) : <div/>}
          </RadioGroup>
        </>)}

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
