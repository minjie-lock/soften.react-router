import { BlockerFunction, createBrowserRouter, RouteObject, useBlocker, useNavigate } from "react-router-dom";
import { BeforeRecord, ResolvePaths, Router, RouterStation } from "../types";
import createBeforeRouter from "./createBeforeRouter";
import React, { lazy } from "react";


export default function createRouter<R extends Router<R>[]>(routes: R): RouterStation<R> {


  const createStationRouter = (routes: Router<R>[]): RouteObject[] => {
    return routes?.map((item) => {
      const {
        beforeLeave,
        beforeEnter,
        ...rest
      } = item;
      const Start = (typeof item?.element === 'function' ?
        lazy(item?.element) : () => item?.element) as () => React.ReactNode;
      const element = createBeforeRouter(
        <Start />,
        [beforeEnter],
        [beforeLeave]
      );

      const children = rest?.children?.length ?
        createStationRouter(rest.children) : [];

      return {
        ...rest,
        element,
        ...(rest.children?.length ? { children } : {}),
      }
    })
  }

  /**
   * @function beforeEnter
   * @description 全局前置路由守卫
   * @param enter 
  */
  const beforeRouter = (before: BeforeRecord<R>) => {

    const {
      enter,
      leave
    } = before;

    station.router = createBrowserRouter(
      routes?.map((item) => {
        const {
          beforeLeave,
          beforeEnter,
          ...rest
        } = item;

        const Start = (typeof item?.element === 'function' ?
          lazy(item?.element) : () => item?.element) as () => React.ReactNode;
        const element = createBeforeRouter(
          <Start />,
          [enter, beforeEnter],
          [leave, beforeLeave],
        );

        const children = rest?.children?.length ?
          createStationRouter(rest.children) : [];

        return {
          ...rest,
          element,
          ...(rest.children?.length ? { children } : {}),
        }
      })
    );
  };

  const useLink = (): (to: ResolvePaths<R> | number) => Promise<boolean> => {
    const toLink = useNavigate();
    const Blocker: BlockerFunction = (location) => {
      const {
        currentLocation,
        nextLocation,
      } = location ?? {};

      return currentLocation?.pathname !== nextLocation?.pathname
    };
  
    const blocker = useBlocker(Blocker);

    return (to: ResolvePaths<R> | number) => {
      return new Promise((resolve) => {
        toLink(to);
        switch (blocker?.state) {
          case 'proceeding': case 'unblocked':
            resolve(true)
            break;
          case 'blocked':
            resolve(false)
            break;
          default:
            resolve(true);
        }
      });
    };
  };

  const router = createBrowserRouter(
    createStationRouter(routes),
  );


  const station: RouterStation<R> = {
    router,
    beforeRouter,
    useLink,
  };


  return station;
};