// @ts-expect-error
import { Cross, Tick } from 'ooni-components/icons'
import type { ReactNode } from 'react'
import { MdPriorityHigh } from 'react-icons/md'

type Tone = 'ok' | 'fail' | 'warn'

const toneClass: Record<Tone, string> = {
  ok: 'text-green-700',
  fail: 'text-red-700',
  warn: 'text-yellow-800',
}

const toneIcon: Record<Tone, ReactNode> = {
  ok: <Tick size={16} />,
  fail: <Cross size={16} />,
  warn: <MdPriorityHigh size={14} />,
}

/** Status is never colour alone: each mark pairs the colour with an icon. */
export const StatusMark = ({
  tone,
  children,
}: {
  tone: Tone
  children?: ReactNode
}) => (
  <span
    className={`inline-flex items-baseline gap-0.5 font-medium ${toneClass[tone]}`}
  >
    <span className="self-center shrink-0">{toneIcon[tone]}</span>
    {children}
  </span>
)

/** Small outlined pill used for per-IP annotations from the control. */
export const Chip = ({
  tone,
  children,
}: {
  tone?: Tone
  children: ReactNode
}) => (
  <span
    className={`inline-block text-[0.65rem] leading-tight px-1.5 py-0.5 border rounded-full ${
      tone
        ? `${toneClass[tone]} border-current`
        : 'text-gray-700 border-gray-300'
    }`}
  >
    {children}
  </span>
)

export const NoData = () => <span className="text-gray-500">—</span>

export const AsnLabel = ({
  asn,
  orgName,
}: {
  asn: number | null | undefined
  orgName: string | null | undefined
}) => {
  if (asn == null) return null
  return (
    <span className="text-xs text-gray-600">
      AS{asn}
      {orgName ? ` · ${orgName}` : ''}
    </span>
  )
}
