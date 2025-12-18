import {
  Heading,
  Paragraph,
  Button,
  Icon,
} from "@amsterdam/design-system-react"
import { ConstructionIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Icon
          svg={ConstructionIcon}
          style={{ fontSize: "48px" }}
          className="mb-2 animate-wobble-every-5s"
        />
        <Heading level={1} className="mb-3">
          Pagina in aanbouw
        </Heading>
        <Paragraph className="mb-5">
          De pagina die je probeert te bereiken, moet nog worden gebouwd.
        </Paragraph>
        <Button type="button" onClick={() => navigate("/")}>
          Terug naar home
        </Button>
      </div>
    </>
  )
}
