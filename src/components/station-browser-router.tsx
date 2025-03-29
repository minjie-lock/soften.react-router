
import { RouterProvider } from "react-router-dom";
import { createRouter } from "src/utils";

type StationRouterProps = {
  router: ReturnType<typeof createRouter>;
};

export default function StationBrowserRouter(props: StationRouterProps) {

  const {
    router
  } = props;

  if (!router.router) {
    throw new Error('需要正确传递路由')
  }

  return (
    <RouterProvider router={router.router} />
  )
}