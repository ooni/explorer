import { useForm, Controller } from 'react-hook-form'
import { Checkbox, colors } from 'ooni-components'
import { useMATContext } from './MATContext'
import { useEffect, useMemo, useState } from 'react'

const getAllBlockingTypes = (dataOG) => {
  return dataOG.reduce((acc, obj) => {
    const failure = obj.failure //.replace(/(?:\[scrubbed\]|\.)*/g, '')
    if (acc[failure]) {
      acc[failure] += obj.observation_count
    } else {
      acc[failure] = obj.observation_count
    }
    // const existing = acc.find(
    //   (item) => item.failure === failure,
    // )
    // if (existing) {
    //   existing[failure] = observation_count
    // } else {
    //   acc.push({
    //     [failure]: observation_count,
    //   })
    // }
    return acc
  }, {})
}

const getSortedBlockingTypes = (OGdata) => {
  const blockingTypes = getAllBlockingTypes(OGdata)
  return Object.entries(blockingTypes)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
}

const ooniColors = [
  colors.red['800'],
  colors.yellow['600'],
  colors.gray['600'],
  colors.blue['600'],
  colors.orange['600'],
  colors.fuchsia['600'],
  colors.pink['600'],
  colors.teal['600'],
]

const chartColors = (selectedBlockingTypes) =>
  selectedBlockingTypes
    .filter((f) => !['none', 'others'].includes(f))
    .reduce(
      (acc, current, i) => {
        acc[current] = ooniColors[i]
        return acc
      },
      {
        none: colors.green['600'],
        other: colors.gray['300'],
      },
    )

const FailureForm = ({ data }) => {
  const [_, updateMATContext] = useMATContext()

  const allBlockingTypes = useMemo(() => getSortedBlockingTypes(data), [data])

  const [includedBlockingTypes, setInlcudedBlockingTypes] =
    useState(allBlockingTypes)

  const [selectedBlockingTypes, setSelectedBlockingTypes] = useState(
    allBlockingTypes.slice(0, 8),
  )

  useEffect(() => {
    updateMATContext(
      {
        legendItems: selectedBlockingTypes,
        colors: chartColors(selectedBlockingTypes),
        includedItems: includedBlockingTypes,
      },
      true,
    )
  }, [selectedBlockingTypes, includedBlockingTypes])

  const { setValue, handleSubmit, control, subscribe } = useForm({
    defaultValues: {
      blockingTypes: allBlockingTypes.reduce((acc, _, i) => {
        acc[i] = { include: true, other: i > 7 }
        return acc
      }, {}),
    },
  })

  useEffect(() => {
    const callback = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values: { blockingTypes } }) => {
        Object.entries(blockingTypes).forEach(([_, value], i) => {
          if (!value.include && value.other) {
            setValue(`blockingTypes.${i}.other`, false, {
              shouldDirty: false,
              shouldTouch: false,
            })
          }
        })
      },
    })

    return () => callback()
  }, [subscribe])

  const onSubmit = (data) => {
    const included = Object.entries(data.blockingTypes)
      .filter(([_, v]) => v.include)
      .map(([k]) => allBlockingTypes[k])
    const selected = Object.entries(data.blockingTypes)
      .filter(([_, v]) => !v.other)
      .map(([k]) => allBlockingTypes[k])

    setInlcudedBlockingTypes(included)
    setSelectedBlockingTypes(selected)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="columns-2">
        {allBlockingTypes?.map((b, i) => (
          <div key={b} className="flex flex-row">
            <Controller
              control={control}
              name={`blockingTypes.${i}.include`}
              render={({ field: includeField }) => (
                <>
                  <Checkbox {...includeField} checked={includeField.value} />
                  <Controller
                    control={control}
                    name={`blockingTypes.${i}.other`}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        disabled={!includeField.value}
                        label={b}
                        checked={field.value}
                      />
                    )}
                  />
                </>
              )}
            />
          </div>
        ))}
      </div>
      {allBlockingTypes.length && (
        <button type="submit" className="btn btn-primary-hollow btn-sm my-4">
          Apply
        </button>
      )}
    </form>
  )
}

export default FailureForm
