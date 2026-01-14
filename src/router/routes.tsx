import { DefaultLayout } from "@/components"
import ChooseThemePage from "@/pages/ListSettings/ChooseThemePage/ChooseThemePage"
import CreateListPage from "@/pages/ListSettings/CreateListPage/CreateListPage"
import NotFound from "@/pages/NotFound/NotFound"
import UnderConstruction from "@/pages/UnderConstruction/UnderConstruction"
import ListPage from "@/pages/ListPage/ListPage"
import ChangeTeamPage from "@/pages/ChangeTeamPage/ChangeTeamPage"
import SearchAddressPage from "@/pages/SearchAddressPage/SearchAddressPage"
import SuggestionPage from "@/pages/SuggestionPage/SuggestionPage"

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "cases/:id", element: <UnderConstruction /> },
      { path: "kies-looplijst", element: <UnderConstruction /> },
      { path: "lijst", element: <UnderConstruction /> },
      { path: "lijst/:itineraryId", element: <ListPage /> },
      { path: "lijst/:itineraryId/wijzig-team", element: <ChangeTeamPage /> },
      { path: "lijst/:itineraryId/suggesties", element: <SuggestionPage /> },
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
      { path: "visit/:itineraryId/:caseId", element: <UnderConstruction /> },
      {
        path: "visit/:itineraryId/:caseId/:id",
        element: <UnderConstruction />,
      },
    ],
  },
]
