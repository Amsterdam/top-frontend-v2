import { DefaultLayout } from "@/components"
import IndexRedirectPage from "@/pages/IndexRedirectPage/IndexRedirectPage"
import ChooseThemePage from "@/pages/ChooseThemePage/ChooseThemePage"
import ListCreatePage from "@/pages/ListCreatePage/ListCreatePage"
import NotFound from "@/pages/NotFound/NotFound"
import UnderConstruction from "@/pages/UnderConstruction/UnderConstruction"
import ListPage from "@/pages/ListPage/ListPage"
import TeamMemberUpdatePage from "@/pages/TeamMemberUpdatePage/TeamMemberUpdatePage"
import SelectStartAddressPage from "@/pages/SelectStartAddressPage/SelectStartAddressPage"
import SearchPage from "@/pages/SearchPage/SearchPage"
import SuggestionPage from "@/pages/SuggestionPage/SuggestionPage"
import VisitCreatePage from "@/pages/VisitCreatePage/VisitCreatePage"
import CaseDetailPage from "@/pages/CaseDetailPage/CaseDetailPage"
import TeamSettingsPage from "@/pages/TeamSettingsPage/TeamSettingsPage"
import ChooseTeamSettingsPage from "@/pages/ChooseTeamSettingsPage/ChooseTeamSettingsPage"
import DaySettingsPage from "@/pages/DaySettingsPage/DaySettingsPage"
import ChooseListPage from "@/pages/ChooseListPage/ChooseListPage"
import PuntentellerPage from "@/pages/PuntentellerPage/PuntentellerPage"
import PuntentellerAdresPage from "@/pages/PuntentellerAdresPage/PuntentellerAdresPage"
import RequirePermissions from "./RequirePermissions"
import { APP_PERMISSIONS } from "@/shared/permissions"

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <IndexRedirectPage /> },
      { path: "zaken/:caseId", element: <CaseDetailPage /> },
      { path: "kies-looplijst", element: <ChooseListPage /> },
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
      {
        path: "lijst/nieuw/:themeId/zoeken",
        element: <SelectStartAddressPage />,
      },
      { path: "lijst-instellingen", element: <ChooseThemePage /> },
      { path: "puntenteller", element: <PuntentellerPage /> },
      { path: "puntenteller/:bagId", element: <PuntentellerAdresPage /> },
      {
        element: (
          <RequirePermissions
            requiredPermissions={APP_PERMISSIONS.manageSettings}
          />
        ),
        children: [
          { path: "team-instellingen", element: <ChooseTeamSettingsPage /> },
          { path: "team-instellingen/:themeId", element: <TeamSettingsPage /> },
          {
            path: "team-instellingen/:themeId/:daySettingsId",
            element: <DaySettingsPage />,
          },
          {
            path: "team-instellingen/:themeId/nieuw/:dayOfWeek",
            element: <DaySettingsPage />,
          },
        ],
      },
      { path: "zoeken", element: <SearchPage /> },
      { path: "bezoek/:itineraryId/:caseId", element: <VisitCreatePage /> }, // CREATE
      {
        path: "bezoek/:itineraryId/:caseId/:visitId", // EDIT
        element: <VisitCreatePage />,
      },
    ],
  },
]
