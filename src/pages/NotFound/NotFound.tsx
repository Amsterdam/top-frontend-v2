import {
  PageHeader,
  Heading,
  Paragraph,
  Button,
} from "@amsterdam/design-system-react"
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router"
import { Icon } from "@amsterdam/design-system-react"
import { FaceSadIcon, HouseIcon } from "@amsterdam/design-system-react-icons"
import { env } from "@/config/env"

export default function NotFound() {
  const navigate = useNavigate()
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  if (!is404) {
    console.error(error)
  }

  return (
    <>
      <PageHeader brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`} />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Icon
          svg={FaceSadIcon}
          aria-hidden="true"
          style={{ fontSize: "48px" }}
          className="ams-mb-s animate-wobble-every-5s"
        />
        <Heading level={1} className="ams-mb-m">
          {is404
            ? "404 - Oeps! We zijn de weg even kwijt."
            : "Er is iets misgegaan!"}
        </Heading>
        <Paragraph className="ams-mb-xl">
          {is404
            ? "De pagina die je zoekt bestaat niet of is verhuisd. Geen zorgen we helpen je graag weer op pad."
            : "Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga terug naar home."}
        </Paragraph>
        <Button onClick={() => navigate("/")} icon={<HouseIcon />}>
          Terug naar home
        </Button>
      </div>
    </>
  )
}
