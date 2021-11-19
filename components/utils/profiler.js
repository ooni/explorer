import { Profiler as NativeProfiler } from 'react'

export const Profiler = ({ children }) => {
  const id = `${children.type.displayName}.${children.key}`
  // console.log(children)
  return (
    <NativeProfiler id={id} onRender={profilerLog}>
      {children}
    </NativeProfiler>
  )
}

export function profilerLog(id, phase, actualTime, baseTime, startTime, commitTime, interactions) {
  console.debug(`${id}: ${phase}: ${actualTime}`)
  // console.debug(`actualTime: ${actualTime}, baseTime: ${baseTime}, startTime, commitTime`)
  const columns = [
    'id', 'phase',
    'actualTime',
    'baseTime',
    // 'startTime',
    // 'commitTime',
    // 'interactions'
  ]
  // console.table([{id, phase, actualTime, baseTime, startTime, commitTime, interactions}], columns)
}