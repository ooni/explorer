import Flag from 'components/Flag'
import { GridBox } from 'components/VirtualizedGrid'
import { Text } from 'ooni-components'

const CountryList = ({ countries, itemsPerRow = 6 }) => {
  return (
    // lg:grid-cols-${itemsPerRow} is added to the safelist in tailwindConfig.config.js
    <div
      className={`grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-${itemsPerRow}`}
    >
      {countries.map((c) => (
        <GridBox
          key={c.alpha_2}
          href={`/country/${c.alpha_2}`}
          title={
            <div className="flex mb-2 items-center">
              <div className="self-start">
                <Flag countryCode={c.alpha_2} size={22} border />
              </div>
              <Text fontSize={1} fontWeight="bold" ml={2} lineHeight="24px">
                {c.localisedName}
              </Text>
            </div>
          }
          count={c.count}
        />
      ))}
    </div>
  )
}

export default CountryList
