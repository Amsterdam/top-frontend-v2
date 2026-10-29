import {
  Accordion,
  Column,
  Grid,
  Heading,
  Paragraph,
  Link,
  OrderedList,
} from "@amsterdam/design-system-react"

export default function VeelgesteldeVragenPage() {
  return (
    <Grid paddingBottom="x-large" paddingTop="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Veelgestelde vragen</Heading>
      </Grid.Cell>

      <Grid.Cell span="all">
        <Heading level={2} className="ams-mb-s">
          Installatie
        </Heading>
        <Column>
          <Accordion headingLevel={3}>
            <Accordion.Section label="Hoe installeer ik TOP op mijn telefoon of tablet?">
              <Column>
                <Paragraph>
                  Je kunt TOP op je telefoon of tablet installeren, zodat je TOP
                  eenvoudig vanaf je startscherm kunt openen. De stappen
                  verschillen per apparaat.
                </Paragraph>

                <Heading level={4}>Android</Heading>
                <OrderedList>
                  <OrderedList.Item>
                    Open TOP in je browser via{" "}
                    <Link href="https://top.amsterdam.nl/">
                      top.amsterdam.nl
                    </Link>
                    .
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Tik op de drie puntjes rechtsboven.
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Kies <strong>‘App installeren’</strong> of{" "}
                    <strong>‘Toevoegen aan startscherm’</strong>.
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Volg de stappen om TOP te installeren.
                  </OrderedList.Item>
                </OrderedList>

                <Heading level={4}>iPhone of iPad</Heading>
                <OrderedList>
                  <OrderedList.Item>
                    Open TOP in <strong>Safari</strong> via{" "}
                    <Link href="https://top.amsterdam.nl/">
                      top.amsterdam.nl
                    </Link>
                    .
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Tik op de <strong>deelknop</strong> (het vierkantje met het
                    pijltje omhoog).
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Kies <strong>‘Zet op beginscherm’</strong>.
                  </OrderedList.Item>
                  <OrderedList.Item>
                    Tik op <strong>‘Voeg toe’</strong>.
                  </OrderedList.Item>
                </OrderedList>
              </Column>
            </Accordion.Section>
          </Accordion>
        </Column>
      </Grid.Cell>

      <Grid.Cell span="all">
        <Heading level={2} className="ams-mb-s">
          Looplijsten
        </Heading>
        <Column>
          <Accordion headingLevel={3}>
            <Accordion.Section label="Waarom kan er vandaag geen looplijst worden aangemaakt?">
              <Column>
                <Paragraph>
                  Als er geen looplijst kan worden aangemaakt, zijn er vandaag
                  mogelijk niet genoeg zaken die voldoen aan de ingestelde
                  criteria. De daginstellingen bepalen welke adressen in
                  aanmerking komen voor je looplijst.
                </Paragraph>
                <Paragraph>
                  Niet iedereen kan de daginstellingen aanpassen. Vraag je
                  teamleider of de collega die verantwoordelijk is voor de
                  daginstellingen om de filters te controleren en zo nodig aan
                  te passen.
                </Paragraph>
              </Column>
            </Accordion.Section>
          </Accordion>

          <Accordion headingLevel={3}>
            <Accordion.Section label="Waarom staan er maar een paar adressen in mijn looplijst?">
              <Column>
                <Paragraph>
                  De daginstellingen bepalen welke adressen in aanmerking komen
                  voor je looplijst. Als je maar een paar adressen ziet, kan het
                  zijn dat er filters actief zijn waaraan weinig adressen
                  voldoen.
                </Paragraph>
                <Paragraph>
                  Niet iedereen kan de daginstellingen aanpassen. Vraag je
                  teamleider of de collega die verantwoordelijk is voor de
                  daginstellingen om de filters te controleren en zo nodig aan
                  te passen.
                </Paragraph>
              </Column>
            </Accordion.Section>
          </Accordion>
          <Accordion headingLevel={3}>
            <Accordion.Section label="Waarom zie ik een toezichthouder of handhaver niet in de lijst met gebruikers?">
              <Paragraph>
                Gebruikers krijgen via het toegangspakket van Microsoft Entra ID
                autorisatie voor AZA en TOP. Een gebruiker wordt automatisch
                aangemaakt in TOP zodra diegene voor de eerste keer inlogt.
                Vraag de toezichthouder of handhaver om een keer in te loggen.
                Ververs daarna je eigen pagina om de gebruiker zichtbaar te
                maken in de lijst.
              </Paragraph>
            </Accordion.Section>
          </Accordion>
        </Column>
      </Grid.Cell>
    </Grid>
  )
}
