import { createBrowserRouter } from "react-router-dom";
import { EnterFn, Router } from "../types";
import createBeforeRouter from "./createBeforeRouter";

type BrowserRouter = ReturnType<typeof createBrowserRouter>

interface RouterResult extends BrowserRouter {
  beforeEnter: (enter: EnterFn) => BrowserRouter;
}


export default function createRouter<R extends Router[]>(routes: R) {

  const createBeforeEach = (routes: Router[]) => {
    return routes?.map((itme) => {
      const {
        beforeLeave,
        beforeEnter,
        ...rest
      } = itme;

      const element = createBeforeRouter(
        rest.element,
        beforeEnter,
        beforeLeave,
      )

      return {
        ...rest,
        element,
      }
    })
  }

  const browser = createBeforeEach(routes);

  const router = createBrowserRouter(browser);

  // const beforeEnter = (enter: EnterFn) => {
  //   return browser?.map((item) => {
  //     return {
  //       ...item,
  //       element: createBeforeRouter(item?.element, enter)
  //     }
  //   })
  // }

  return router;
};

