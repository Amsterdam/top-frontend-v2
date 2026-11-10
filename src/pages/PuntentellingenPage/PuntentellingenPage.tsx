import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Grid,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { PlusIcon } from "@amsterdam/design-system-react-icons"
import { useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router"
import { useAddressPuntentellingen, useBagPdokAddress } from "@/api/hooks"
import { AmsterdamCrossSpinner, Table } from "@/components"
import { formatDate } from "@/shared/dateFormatters"
import { formatPunten } from "@/shared/formatPunten"
import { useDialog } from "@/hooks/useDialog"
import { DeletePuntentellingButton } from "./DeletePuntentellingButton"
import { EditPuntentellingButton } from "./EditPuntentellingButton"
import {
  DELETE_PUNTENTELLING_DIALOG_ID,
  DeletePuntentellingDialog,
} from "./DeletePuntentellingDialog"
import styles from "./PuntentellingenPage.module.css"

type RowActions = {
  onEdit: (puntentelling: Puntentelling) => void
  onDelete: (puntentelling: Puntentelling) => void
}

const getColumns = ({ onEdit, onDelete }: RowActions) =>
  [
    {
      title: "Punten",
      dataIndex: "punten",
      // Only a concept is marked: whether the author is still working on it.
      render: (punten: unknown, puntentelling: Puntentelling) => {
        return (
          <Row gap="small" wrap alignVertical="center">
            {formatPunten(punten as number)}
            {!puntentelling.completed && (
              <Badge label="Concept" color="orange" />
            )}
          </Row>
        )
      },
    },
    {
      title: "Opsteller",
      dataIndex: "author.full_name",
      render: (fullName: unknown) =>
        (fullName as string | undefined) || "Onbekend",
    },
    {
      title: "Aangemaakt",
      dataIndex: "created",
      render: (created: unknown) =>
        formatDate(created as string, "D MMM YYYY, HH:mm"),
      hideOnMobile: true,
    },
    {
      title: "Gewijzigd",
      dataIndex: "updated",
      render: (updated: unknown) =>
        formatDate(updated as string, "D MMM YYYY, HH:mm"),
      hideOnMobile: true,
    },
    {
      title: "",
      dataIndex: "id",
      render: (_id: unknown, puntentelling: Puntentelling) => (
        <Row gap="small" align="end">
          <EditPuntentellingButton onClick={() => onEdit(puntentelling)} />
          <DeletePuntentellingButton onClick={() => onDelete(puntentelling)} />
        </Row>
      ),
    },
  ] as const

export default function PuntentellingenPage() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  // Not waited for: the page works without it, see adres below.
  const { data: pdokAddress } = useBagPdokAddress(bagId)
  // Passed on to the wizard, e.g. ?dummydata=<naam> (see useInitialValues).
  const { search } = useLocation()
  const nieuwUrl = `/puntenteller/${bagId}/nieuw${search}`
  const {
    data: puntentellingen,
    isPending,
    isFetching,
    isError,
  } = useAddressPuntentellingen(bagId)
  const [teVerwijderen, setTeVerwijderen] = useState<Puntentelling>()
  const { openDialog } = useDialog(DELETE_PUNTENTELLING_DIALOG_ID)
  const onDelete = (puntentelling: Puntentelling) => {
    setTeVerwijderen(puntentelling)
    openDialog()
  }

  // "Aalsmeerplein 1-H": the part of PDOK's weergavenaam before the postcode, as in the search.
  const adres = pdokAddress?.weergavenaam.split(",")[0]

  // An empty list from the cache may be stale (a colleague may have saved one since), so it's
  // only redirected on once the refetch is in.
  const isEmpty = puntentellingen?.length === 0
  if (isPending || (isEmpty && isFetching)) return <AmsterdamCrossSpinner />

  // Without puntentellingen there's nothing to choose from: straight on to a new one. `replace`,
  // so going back doesn't land here and get sent on again.
  if (isEmpty) return <Navigate to={nieuwUrl} replace />

  return (
    <Grid paddingBottom="x-large" paddingTop="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Breadcrumb accessibleName="Kruimelpad">
          <Breadcrumb.Link
            href="/puntenteller"
            onClick={(e) => {
              e.preventDefault()
              navigate("/puntenteller")
            }}
          >
            Puntenteller
          </Breadcrumb.Link>
          <Breadcrumb.Link aria-current="location">
            {adres || "Puntentellingen"}
          </Breadcrumb.Link>
        </Breadcrumb>
        <Row align="between" alignVertical="center" wrap>
          <Heading level={1}>Puntentellingen {adres && `(${adres})`}</Heading>
          <Button
            variant="primary"
            iconBefore
            icon={PlusIcon}
            onClick={() => navigate(nieuwUrl)}
          >
            Nieuwe puntentelling
          </Button>
        </Row>
      </Grid.Cell>

      {isError ? (
        <Grid.Cell span="all" appearance="transparent">
          <Alert
            heading="Puntentellingen niet opgehaald"
            headingLevel={2}
            severity="error"
          >
            <Paragraph>
              De puntentellingen van dit adres konden niet worden opgehaald.
              Probeer het later opnieuw.
            </Paragraph>
          </Alert>
        </Grid.Cell>
      ) : (
        <Grid.Cell span="all">
          <Table
            className={styles.table}
            columns={getColumns({
              onEdit: ({ id }) => navigate(`/puntenteller/${bagId}/${id}`),
              onDelete,
            })}
            data={puntentellingen}
          />
          <DeletePuntentellingDialog
            bagId={bagId}
            puntentelling={teVerwijderen}
          />
        </Grid.Cell>
      )}
    </Grid>
  )
}
