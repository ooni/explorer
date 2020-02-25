import React, { useContext } from 'react'
import PropTypes from 'prop-types'

// TODO: Maybe add period information to update data in all sections when
// period filter is updated in one of the sections

export const CountryContext = React.createContext()

export const CountryContextProvider = ({
  countryCode,
  countryName,
  children
}) => (
  <CountryContext.Provider value={{
    countryCode,
    countryName
  }}>
    {children}
  </CountryContext.Provider>
)

CountryContextProvider.propTypes = {
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  children: PropTypes.children
}


/* HoC to inject Country context into wrapped components */
export const inCountry = (WrappedComponent) => {
  return function InjectCountry(props) {
    return (
      <CountryContext.Consumer>
        {({countryCode, countryName}) => (
          <WrappedComponent
            {...props}
            countryCode={countryCode}
            countryName={countryName}
          />
        )}
      </CountryContext.Consumer>
    )
  }
}

/* Custom Hook to use CountryContext */
export const useCountry = () => {
  return useContext(CountryContext)
}
