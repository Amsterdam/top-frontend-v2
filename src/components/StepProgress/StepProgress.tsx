import {
  Heading,
  Icon,
  Row,
  LinkList,
  type IconProps,
} from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import styles from "./StepProgress.module.css"

export type StepItem = {
  title: string
  icon?: IconProps["svg"]
  percentage?: number
}

export type StepProgressProps = {
  steps: StepItem[]
  currentStep: number
  onPrevious?: () => void
}

export function StepProgress({
  steps,
  currentStep,
  onPrevious,
}: StepProgressProps) {
  const totalSteps = steps.length

  const hasCustomPercentages = steps.some(
    (step) => step.percentage !== undefined,
  )

  const normalizedSteps = steps.map((step) => ({
    ...step,
    percentage: hasCustomPercentages
      ? (step.percentage ?? 0)
      : 100 / totalSteps,
  }))

  const progress = normalizedSteps
    .slice(0, currentStep)
    .reduce((acc, step) => acc + (step.percentage || 0), 0)

  const currentStepItem = steps[currentStep - 1]

  return (
    <div className="ams-mb-l">
      <Row alignVertical="center" gap="large">
        <Heading level={3} className={styles.heading}>
          Stap {currentStep} van {totalSteps}
        </Heading>

        <Row alignVertical="center" gap="small">
          {currentStepItem?.icon && (
            <Icon svg={currentStepItem.icon} size="heading-3" />
          )}
          <Heading level={3}>{currentStepItem?.title}</Heading>
        </Row>
      </Row>

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>

      {/* Vorige stap alleen als huidige stap > 1 */}
      {currentStep > 1 && onPrevious && (
        <div className={styles.previousLink}>
          <LinkList>
            <LinkList.Link
              href="#"
              icon={ChevronBackwardIcon}
              onClick={(e) => {
                e.preventDefault()
                onPrevious()
              }}
            >
              Vorige stap
            </LinkList.Link>
          </LinkList>
        </div>
      )}
    </div>
  )
}
