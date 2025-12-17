import { Heading, Paragraph, Button } from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Heading level={1}>Pagina in aanbouw</Heading>
      <Paragraph>
        De pagina die je probeert te bereiken, moet nog worden gebouwd.
      </Paragraph>
      <Button type="button" onClick={() => navigate("/")}>
        Terug naar home
      </Button>
    </>
  )
}
