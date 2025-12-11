import { DefaultLayout } from "@/components"
import Home from "@/pages/Looplijst/Looplijst"
import NotFound from "@/pages/NotFound/NotFound"

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "looplijst",
        element: <Home />,
      },
    ],
  },
]
