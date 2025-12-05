import Home from "@/pages/Home/Home"
import NotFound from "@/pages/NotFound/NotFound"

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]
