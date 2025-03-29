import { createBrowserRouter, useNavigate } from "react-router-dom";
import { EnterFn, LeaveFn, ResolvePaths, Router } from "../types";
import createBeforeRouter from "./createBeforeRouter";

type BrowserRouter = ReturnType<typeof createBrowserRouter>;

interface RouterStation<R extends readonly Router[]> {
  /**
   * @function beforeEnter
   * @description 全局前置路由守卫
   * @param enter 创建前调用
   * @param leave 退出前调用
  */
  beforeRouter: (enter?: EnterFn<ResolvePaths<R>>, leave?: LeaveFn) => void;
  router?: BrowserRouter;
  /**
   * @function useLink
   * @description 带有路径提示的路由航行
   * @returns 一个 hook 函数，需要带 use 命名开头
   */
  useLink: () => (to: ResolvePaths<R>) => void;
}


export default function createRouter<R extends Router[]>(routes: R): RouterStation<R> {

  /**
   * @function beforeEnter
   * @description 全局前置路由守卫
   * @param enter 
  */
  const beforeRouter = (
    enter?: EnterFn<ResolvePaths<R>>,
    leave?: LeaveFn
  ) => {
    station.router = createBrowserRouter(
      routes?.map((item) => {
        const {
          beforeLeave,
          beforeEnter,
          ...rest
        } = item;

        const element = createBeforeRouter<ResolvePaths<R>>(
          item?.element,
          [enter, beforeEnter],
          [leave, beforeLeave],
        );

        return {
          ...rest,
          element,
        }
      })
    );
  };

  const useLink = () => {
    const link = useNavigate();
    return (to: ResolvePaths<R>) => link(to);
  }

  const router = createBrowserRouter(
    routes?.map((item) => {
      const {
        beforeLeave,
        beforeEnter,
        ...rest
      } = item;
      const element = createBeforeRouter<ResolvePaths<R>>(
        item?.element,
        [beforeEnter],
        [beforeLeave]
      );

      return {
        ...rest,
        element,
      }
    })
  );


  const station: RouterStation<R> = {
    router,
    beforeRouter,
    useLink,
  };


  return station;
};

