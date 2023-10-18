import { Profiler as NativeProfiler } from 'react'

export const Profiler = ({ id, children }) => {
  const _id = `${id || children.type.type.displayName}.${children.key}`
  
  return (
    <NativeProfiler id={_id} onRender={profilerLog}>
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