import { IconButton } from "@amsterdam/design-system-react"
import { DeleteIcon } from "@amsterdam/design-system-react-icons"
import { useDeleteDaySetting } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useToast } from "@/components/toasts/useToast"
import { useDialog } from "@/hooks/useDialog"

export function DeleteDaySettingsButton({
  daySettingId,
  daySettingName,
  teamId,
}: {
  daySettingId: number
  daySettingName: string
  teamId: string
}) {
  const deleteDaySetting = useDeleteDaySetting({ daySettingId, teamId })
  const { showToast } = useToast()
  const dialogId = `delete-day-setting-${daySettingId}`
  const { openDialog } = useDialog(dialogId)

  const handleDelete = () => {
    deleteDaySetting.mutate(undefined, {
      onSuccess: () => {
        showToast({
          title: "Instelling verwijderd",
          description: `De instelling "${daySettingName}" is succesvol verwijderd.`,
          severity: "success",
        })
      },
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
        onOk={handleDelete}
        onOkText="Verwijderen"
        loading={deleteDaySetting.isPending}
      />
    </>
  )
}

export default DeleteDaySettingsButton
