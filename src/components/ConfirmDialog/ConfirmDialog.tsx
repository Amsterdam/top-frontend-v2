import type { ReactNode } from "react"
import {
  Dialog,
  ActionGroup,
  Button,
  Paragraph,
  Icon,
} from "@amsterdam/design-system-react"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  id: string
  title?: string
  content?: ReactNode
  onOk: () => void
  onOkText?: string
  loading?: boolean
}

export function ConfirmDialog({
  id,
  title,
  content,
  onOk,
  onOkText,
  loading = false,
}: Props) {
  return (
    <Dialog
      id={id}
      footer={
        <ActionGroup>
          <Button
            form="ams-dialog-asking-to-confirm-form"
            onClick={onOk}
            disabled={loading}
            aria-busy={loading}
          >
            {loading && (
              <Icon
                svg={SettingsIcon}
                size="heading-4"
                style={{ animation: "spin 2s linear infinite" }}
              />
            )}
            {onOkText ?? "Doorgaan"}
          </Button>
          <Button onClick={Dialog.close} variant="secondary">
            Annuleren
          </Button>
        </ActionGroup>
      }
      heading={title ?? "Weet je het zeker?"}
    >
      <Paragraph style={{ marginBottom: 12 }}>
        {content ??
          "Weet je zeker dat je door wilt gaan met het uitvoeren van deze actie?"}
      </Paragraph>
    </Dialog>
  )
}

export default ConfirmDialog
