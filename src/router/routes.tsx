import { DefaultLayout } from "@/components"
import ChooseThemePage from "@/pages/ChooseThemePage/ChooseThemePage"
import CreateListPage from "@/pages/CreateListPage/CreateListPage"
import NotFound from "@/pages/NotFound/NotFound"
import UnderConstruction from "@/pages/UnderConstruction/UnderConstruction"
import ListPage from "@/pages/ListPage/ListPage"
import UpdateTeamMemberPage from "@/pages/UpdateTeamMemberPage/UpdateTeamMemberPage"
import SearchAddressPage from "@/pages/SearchAddressPage/SearchAddressPage"
import SuggestionPage from "@/pages/SuggestionPage/SuggestionPage"
import CreateVisitPage from "@/pages/CreateVisitPage/CreateVisitPage"
import CaseDetailPage from "@/pages/CaseDetailPage/CaseDetailPage"

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
        element: <UpdateTeamMemberPage />,
      },
      { path: "lijst/:itineraryId/suggesties", element: <SuggestionPage /> },
      { path: "lijst/:itineraryId/zaken/:caseId", element: <CaseDetailPage /> },
      { path: "lijst/:itineraryId/zoeken", element: <UnderConstruction /> },
      { path: "lijst/nieuw/:themeId", element: <CreateListPage /> },
      { path: "lijst/nieuw/:themeId/zoeken", element: <SearchAddressPage /> },
      { path: "lijst-instellingen", element: <ChooseThemePage /> },
      { path: "team-settings", element: <UnderConstruction /> },
      { path: "team-settings/:themeId", element: <UnderConstruction /> },
      {
        path: "team-settings/:themeId/:daySettingsId",
        element: <UnderConstruction />,
      },
      {
        path: "team-settings/:themeId/nieuw",
        element: <UnderConstruction />,
      },
      { path: "zoeken", element: <UnderConstruction /> },
      { path: "bezoek/:itineraryId/:caseId", element: <CreateVisitPage /> }, // CREATE
      {
        path: "bezoek/:itineraryId/:caseId/:visitId", // EDIT
        element: <CreateVisitPage />,
      },
    ],
  },
]
