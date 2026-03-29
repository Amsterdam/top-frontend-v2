import { DefaultLayout } from "@/components"
import ChooseThemePage from "@/pages/ChooseThemePage/ChooseThemePage"
import ListCreatePage from "@/pages/ListCreatePage/ListCreatePage"
import NotFound from "@/pages/NotFound/NotFound"
import UnderConstruction from "@/pages/UnderConstruction/UnderConstruction"
import ListPage from "@/pages/ListPage/ListPage"
import TeamMemberUpdatePage from "@/pages/TeamMemberUpdatePage/TeamMemberUpdatePage"
import SearchAddressPage from "@/pages/SearchAddressPage/SearchAddressPage"
import SuggestionPage from "@/pages/SuggestionPage/SuggestionPage"
import VisitCreatePage from "@/pages/VisitCreatePage/VisitCreatePage"
import CaseDetailPage from "@/pages/CaseDetailPage/CaseDetailPage"
import TeamSettingsPage from "@/pages/TeamSettingsPage/TeamSettingsPage"
import ChooseTeamSettingsPage from "@/pages/ChooseTeamSettingsPage/ChooseTeamSettingsPage"
import DaySettingsPage from "@/pages/DaySettingsPage/DaySettingsPage"

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "zaken/:caseId", element: <CaseDetailPage /> },
      { path: "kies-looplijst", element: <UnderConstruction /> },
      { path: "lijst", element: <UnderConstruction /> },
      { path: "lijst/:itineraryId", element: <ListPage /> },
      {
        path: "lijst/:itineraryId/wijzig-team",
        element: <TeamMemberUpdatePage />,
      },
      { path: "lijst/:itineraryId/suggesties", element: <SuggestionPage /> },
      { path: "lijst/:itineraryId/zaken/:caseId", element: <CaseDetailPage /> },
      { path: "lijst/:itineraryId/zoeken", element: <UnderConstruction /> },
      { path: "lijst/nieuw/:themeId", element: <ListCreatePage /> },
      { path: "lijst/nieuw/:themeId/zoeken", element: <SearchAddressPage /> },
      { path: "lijst-instellingen", element: <ChooseThemePage /> },
      { path: "team-settings", element: <ChooseTeamSettingsPage /> },
      { path: "team-settings/:themeId", element: <TeamSettingsPage /> },
      {
        path: "team-settings/:themeId/:daySettingsId",
        element: <DaySettingsPage />,
      },
      {
        path: "team-settings/:themeId/nieuw/:dayOfWeek",
        element: <DaySettingsPage />,
      },
      { path: "zoeken", element: <UnderConstruction /> },
      { path: "bezoek/:itineraryId/:caseId", element: <VisitCreatePage /> }, // CREATE
      {
        path: "bezoek/:itineraryId/:caseId/:visitId", // EDIT
        element: <VisitCreatePage />,
      },
    ],
  },
]
