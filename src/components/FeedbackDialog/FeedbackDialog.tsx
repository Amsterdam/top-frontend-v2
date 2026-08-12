import { useState, type SubmitEventHandler } from "react"
import {
  ActionGroup,
  Button,
  Dialog,
  Label,
  Paragraph,
  TextArea,
} from "@amsterdam/design-system-react"
import { useSendFeedback } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { useDialog } from "@/hooks/useDialog"

const FORM_ID = "feedback-form"

type Props = {
  id: string
}

export function FeedbackDialog({ id }: Props) {
  const [feedback, setFeedback] = useState("")
  const sendFeedback = useSendFeedback()
  const { closeDialog } = useDialog(id)
  const { showToast } = useToast()

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!feedback.trim()) return

    sendFeedback.mutate(feedback, {
      onSuccess: () => {
        setFeedback("")
        closeDialog()
        showToast({
          title: "Bedankt voor je feedback",
          description: "We hebben je melding ontvangen.",
          severity: "success",
        })
      },
    })
  }

  return (
    <Dialog
      id={id}
      heading="Feedback"
      footer={
        <ActionGroup>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={sendFeedback.isPending || !feedback.trim()}
            aria-busy={sendFeedback.isPending}
          >
            {sendFeedback.isPending ? "Versturen..." : "Versturen"}
          </Button>
          <Button onClick={closeDialog} variant="secondary" type="button">
            Annuleren
          </Button>
        </ActionGroup>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit}>
        <Label htmlFor="feedback-text" inFieldSet>
          Wat is je feedback of welke bug heb je gevonden?
        </Label>
        <TextArea
          id="feedback-text"
          name="feedback"
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </form>
      {sendFeedback.isError && (
        <Paragraph style={{ color: "var(--ams-color-feedback-error)" }}>
          Versturen mislukt, probeer het opnieuw.
        </Paragraph>
      )}
    </Dialog>
  )
}

export default FeedbackDialog
