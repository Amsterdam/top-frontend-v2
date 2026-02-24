import { IconButton } from "@amsterdam/design-system-react"
import { DeleteIcon } from "@amsterdam/design-system-react-icons"
import { useDaySettings } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { useDialog } from "@/hooks/useDialog"

export function DeleteDaySettingsButton({
  daySettingId,
  daySettingName,
}: {
  daySettingId: number
  daySettingName: string
}) {
  const [, { execDelete, isBusy }] = useDaySettings(daySettingId, {
    lazy: true,
  })
  const { showAlert } = useAlert()
  const dialogId = `delete-day-setting-${daySettingId}`
  const { openDialog } = useDialog(dialogId)

  const deleteDaySetting = async () => {
    execDelete({
      clearCacheKeys: ["/team-settings"],
    }).then(() => {
      showAlert({
        title: "Instelling verwijderd",
        description: `De instelling "${daySettingName}" is succesvol verwijderd.`,
        severity: "success",
      })
    })
  }

  return (
    <>
      <IconButton
        svg={DeleteIcon}
        label="Verwijder instelling"
        title="Verwijder instelling"
        size="heading-3"
        onClick={(e) => {
          e.stopPropagation()
          openDialog()
        }}
      />
      <ConfirmDialog
        id={dialogId}
        title="Instelling verwijderen"
        content={
          <span>
            Weet je zeker dat je de instelling{" "}
            <strong>"{daySettingName}"</strong> wilt verwijderen?
          </span>
        }
        onOk={deleteDaySetting}
        onOkText="Verwijderen"
        loading={isBusy}
      />
    </>
  )
}

export default DeleteDaySettingsButton
