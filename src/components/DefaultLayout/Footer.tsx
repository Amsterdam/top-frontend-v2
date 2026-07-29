import { PageFooter } from "@amsterdam/design-system-react"
import { FeedbackDialog } from "@/components/FeedbackDialog/FeedbackDialog"
import { useDialog } from "@/hooks/useDialog"

const FEEDBACK_DIALOG_ID = "feedback-dialog"

export function Footer() {
  const { openDialog } = useDialog(FEEDBACK_DIALOG_ID)

  return (
    <>
      <PageFooter className="ams-page-footer ams-page__area--footer">
        <PageFooter.Menu data-testid="app-footer-navigation">
          <PageFooter.MenuLink
            href="#"
            data-testid="app-footer-navigation-link-support"
            onClick={(e) => {
              e.preventDefault()
              openDialog()
            }}
          >
            Feedback
          </PageFooter.MenuLink>
        </PageFooter.Menu>
      </PageFooter>

      <FeedbackDialog id={FEEDBACK_DIALOG_ID} />
    </>
  )
}

export default Footer
