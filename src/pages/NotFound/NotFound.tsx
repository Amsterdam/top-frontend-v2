import {
  PageHeader,
  Heading,
  Paragraph,
  Button,
} from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"
import { Icon } from "@amsterdam/design-system-react"
import { FaceSadIcon } from "@amsterdam/design-system-react-icons"
import { env } from "@/config/env"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`} />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Icon
          svg={FaceSadIcon}
          style={{ fontSize: "48px" }}
          className="mb-2 animate-wobble-every-5s"
        />
        <Heading level={1} className="mb-3">
          404 - Pagina niet gevonden
        </Heading>
        <Paragraph className="mb-5">
          De pagina die je probeert te bereiken bestaat niet of is verplaatst.
        </Paragraph>
        <Button onClick={() => navigate("/")}>Terug naar home</Button>
      </div>
    </>
  )
}
