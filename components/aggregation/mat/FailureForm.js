import { useForm, Controller, useWatch } from 'react-hook-form'
import { Checkbox } from 'ooni-components'
import { useEffect, useMemo, useRef, useCallback, forwardRef } from 'react'
import { useBlockingTypes } from './BlockingTypesContext'

const FailureForm = ({ afterSubmit }) => {
  const { state, dispatch } = useBlockingTypes()
  const allBlockingTypes = state.all

  const { setValue, handleSubmit, control, subscribe, watch, reset } = useForm({
    defaultValues: {
      blockingTypes: allBlockingTypes.reduce((acc, _, i) => {
        acc[i] = {
          include: state.included.includes(allBlockingTypes[i]),
          other: !state.selected.includes(allBlockingTypes[i]),
        }
        return acc
      }, {}),
    },
  })

  // Keep form in sync if external state changes list order/contents
  useEffect(() => {
    const defaults = {
      blockingTypes: allBlockingTypes.reduce((acc, _, i) => {
        acc[i] = {
          include: state.included.includes(allBlockingTypes[i]),
          other: !state.selected.includes(allBlockingTypes[i]),
        }
        return acc
      }, {}),
    }
    reset(defaults)
  }, [allBlockingTypes, state.included, state.selected, reset])

  const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, className = '', ...rest }, ref) => {
      const defaultRef = useRef()
      const resolvedRef = ref || defaultRef

      useEffect(() => {
        if (resolvedRef.current) {
          resolvedRef.current.indeterminate = indeterminate
        }
      }, [resolvedRef, indeterminate])

      return (
        <input
          type="checkbox"
          ref={resolvedRef}
          className={className}
          {...rest}
        />
      )
    },
  )
  IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

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

  // Compute master checkbox states
  const blockingTypes = useWatch({ control, name: 'blockingTypes' }) || {}
  const totalCount = allBlockingTypes.length

  const counts = useMemo(() => {
    let included = 0
    let selected = 0
    for (let i = 0; i < totalCount; i += 1) {
      const v = blockingTypes[i] || { include: false, other: false }
      if (v.include) included += 1
      if (v.other) selected += 1
    }
    return { included, selected }
  }, [blockingTypes, totalCount])

  const includedMasterChecked = useMemo(
    () => totalCount > 0 && counts.included === totalCount,
    [totalCount, counts.included],
  )
  const includedMasterIndeterminate = useMemo(
    () => counts.included > 0 && counts.included < totalCount,
    [counts.included, totalCount],
  )

  const selectedMasterChecked = useMemo(
    () => totalCount > 0 && counts.selected === totalCount,
    [totalCount, counts.selected],
  )
  const selectedMasterIndeterminate = useMemo(
    () => counts.selected > 0 && counts.selected < totalCount,
    [counts.selected, totalCount],
  )

  const handleToggleIncludedAll = useCallback(
    (e) => {
      const checked = e.target.checked
      for (let i = 0; i < totalCount; i += 1) {
        setValue(`blockingTypes.${i}.include`, checked, {
          shouldDirty: false,
          shouldTouch: false,
        })
        if (!checked) {
          // If not included, ensure it's not selected
          setValue(`blockingTypes.${i}.other`, false, {
            shouldDirty: false,
            shouldTouch: false,
          })
        }
      }
    },
    [setValue, totalCount],
  )

  const handleToggleSelectedAll = useCallback(
    (e) => {
      const checked = e.target.checked
      for (let i = 0; i < totalCount; i += 1) {
        const v = blockingTypes[i] || { include: false, other: true }
        if (v.include) {
          setValue(`blockingTypes.${i}.other`, checked, {
            shouldDirty: false,
            shouldTouch: false,
          })
        }
      }
    },
    [blockingTypes, setValue, totalCount],
  )

  const onSubmit = ({ blockingTypes }) => {
    const included = Object.entries(blockingTypes)
      .filter(([_, v]) => v.include)
      .map(([k]) => allBlockingTypes[k])
    const selected = Object.entries(blockingTypes)
      .filter(([_, v]) => v.include && !v.other)
      .map(([k]) => allBlockingTypes[k])

    dispatch({ type: 'setIncluded', payload: included })
    dispatch({ type: 'setSelected', payload: selected })
    afterSubmit()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left p-2 w-24">Include in the chart</th>
              <th className="text-left p-2 w-24">Show as "other"</th>
              <th className="text-left p-2">Failure type</th>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <IndeterminateCheckbox
                    id="include-all"
                    checked={includedMasterChecked}
                    indeterminate={includedMasterIndeterminate}
                    onChange={handleToggleIncludedAll}
                  />
                  <label htmlFor="include-all" className="text-sm font-medium">
                    All
                  </label>
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <IndeterminateCheckbox
                    id="select-all"
                    checked={selectedMasterChecked}
                    indeterminate={selectedMasterIndeterminate}
                    onChange={handleToggleSelectedAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    All
                  </label>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {allBlockingTypes?.map((b, i) => (
              <tr key={b} className="border-b border-gray-200">
                <td className="p-2">
                  <Controller
                    control={control}
                    name={`blockingTypes.${i}.include`}
                    render={({ field: includeField }) => (
                      <input
                        type="checkbox"
                        {...includeField}
                        checked={includeField.value}
                      />
                    )}
                  />
                </td>
                <td className="p-2">
                  <Controller
                    control={control}
                    name={`blockingTypes.${i}.other`}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        {...field}
                        disabled={!blockingTypes[i]?.include}
                        checked={field.value}
                      />
                    )}
                  />
                </td>
                <td className="p-2">
                  <span className="text-sm">{b}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        className="btn btn-primary-hollow btn-sm my-4 float-end mx-6"
      >
        Apply
      </button>
    </form>
  )
}

export default FailureForm
