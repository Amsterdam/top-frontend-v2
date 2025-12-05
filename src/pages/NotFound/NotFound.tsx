import {
  PageHeader,
  Heading,
  Paragraph,
  Button,
} from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"
import { env } from "@/config/env"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`} />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Heading level={1}>404 - Pagina niet gevonden</Heading>
        <Paragraph>
          De pagina die je probeert te bereiken bestaat niet of is verplaatst.
        </Paragraph>
        <Button type="button" onClick={() => navigate("/")}>
          Terug naar home
        </Button>
      </div>
    </>
  )
}
