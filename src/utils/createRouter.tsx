import { createBrowserRouter, useNavigate } from "react-router-dom";
import { BeforeRecord, ResolvePaths, Router, RouterStation } from "../types";
import createBeforeRouter from "./createBeforeRouter";
import React, { lazy } from "react";


export default function createRouter<R extends Router<R>[]>(routes: R): RouterStation<R> {

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

        return {
          ...rest,
          element,
        }
      })
    );
  };

  const useLink = () => {
    const toLink = useNavigate();
    return (to: ResolvePaths<R> | number) => toLink(to);
  }

  const router = createBrowserRouter(
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