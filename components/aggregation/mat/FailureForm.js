import { useForm, Controller } from 'react-hook-form'
import { Checkbox } from 'ooni-components'
import { useEffect } from 'react'

const FailureForm = ({
  allBlockingTypes,
  setInlcudedBlockingTypes,
  setSelectedBlockingTypes,
  // includedBlockingTypes,
  // selectedBlockingTypes,
}) => {
  const { setValue, handleSubmit, control, subscribe } = useForm({
    defaultValues: {
      blockingTypes: allBlockingTypes.reduce((acc, _, i) => {
        acc[i] = { include: true, other: i > 6 }
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
  }, [subscribe, setValue])

  const onSubmit = (data) => {
    const included = Object.entries(data.blockingTypes)
      .filter(([_, v]) => v.include)
      .map(([k]) => allBlockingTypes[k])
    const selected = Object.entries(data.blockingTypes)
      .filter(([_, v]) => v.include && !v.other)
      .map(([k]) => allBlockingTypes[k])

    setInlcudedBlockingTypes(included)
    setSelectedBlockingTypes(selected)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="columns-2">
        {allBlockingTypes?.map((b, i) => (
          <div key={b} className="flex flex-row gap-2">
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
                        className="gap-2"
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
