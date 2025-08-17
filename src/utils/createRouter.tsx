import { createBrowserRouter, RouteObject, useNavigate } from "react-router-dom";
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

  const useLink = () => {
    const toLink = useNavigate();
    return (to: ResolvePaths<R> | number) => toLink(to);
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