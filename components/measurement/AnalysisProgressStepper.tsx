import { useIntl } from 'react-intl'

type StepState = 'complete' | 'active' | 'pending'

const StepDot = ({ state }: { state: StepState }) => {
  if (state === 'complete') {
    return (
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-white"
        aria-hidden
      />
    )
  }
  if (state === 'active') {
    return (
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-white/80"
        aria-hidden
      />
    )
  }
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-white bg-transparent"
      aria-hidden
    />
  )
}

const Connector = ({ dashed }: { dashed?: boolean }) => (
  <span
    className={`mx-2 w-10 shrink-0 ${dashed ? 'border-t border-dashed border-white' : 'h-px bg-white'}`}
    aria-hidden
  />
)

interface AnalysisProgressStepperProps {
  isPreliminary: boolean
}

const AnalysisProgressStepper = ({
  isPreliminary,
}: AnalysisProgressStepperProps) => {
  const intl = useIntl()

  const analyzingState: StepState = isPreliminary ? 'active' : 'complete'
  const finalState: StepState = isPreliminary ? 'pending' : 'complete'

  const steps = [
    {
      label: intl.formatMessage({ id: 'Measurement.Hero.Progress.Measured' }),
      state: 'complete' as const,
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Hero.Progress.Analyzing' }),
      state: analyzingState,
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Hero.Progress.Final' }),
      state: finalState,
    },
  ]

  return (
    <div
      className="flex items-center text-sm font-normal"
      role="status"
      aria-live="polite"
      aria-label={intl.formatMessage({
        id: isPreliminary
          ? 'Measurement.Hero.Progress.Analyzing'
          : 'Measurement.Hero.Progress.Final',
      })}
    >
      {steps.map((step, index) => (
        <span key={step.label} className="flex items-center">
          {index > 0 && <Connector dashed={isPreliminary && index === 2} />}
          <span className="flex items-center gap-1.5">
            <StepDot state={step.state} />
            <span>{step.label}</span>
          </span>
        </span>
      ))}
    </div>
  )
}

export default AnalysisProgressStepper
