# AGENTS.md

Instructies voor AI-codeerassistenten die in deze repo werken.

TOP (Toezicht op pad) is een app voor toezichthouders van de gemeente Amsterdam om looplijsten met adressen samen te stellen en bezoeken vast te leggen. Het is een remake van de oude React 17-app. Stack: Vite, TypeScript, React 19, React Router, TanStack Query, Amsterdam Design System. Draait als PWA (zie README voor de cachingstrategie).

## Regels

### Dependencies

- Voeg geen nieuwe dependencies toe zonder expliciete toestemming. Los het eerst op met wat er al is: React, het Amsterdam Design System, TanStack Query, dayjs, `@amsterdam/ee-ads-rhf` voor formulieren.
- Is een nieuwe dependency echt nodig, leg dan uit waarom en welke alternatieven je hebt overwogen.

### FAQ bijhouden

- Verandert er iets wat gebruikers zien of doen (nieuwe pagina, nieuwe flow, gewijzigd gedrag, nieuwe velden, offline-gedrag)? Controleer dan of de veelgestelde vragen in `src/pages/VeelgesteldeVragenPage/faqSections.ts` bijgewerkt moeten worden, en doe dat.
- Puur technische wijzigingen (refactors, tests, tooling) hebben geen FAQ-update nodig.
