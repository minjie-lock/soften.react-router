import { createBrowserRouter, RouteObject, useNavigate } from "react-router-dom";
import { ResolvePaths, Router, RouterStation } from '../types';
import { lazy } from "react";


export default function createRouter<R extends Router<never[]>[]>(routes: R): RouterStation<R> {


  const createStationRouter = (routes: Router<R>[]): RouteObject[] => {
    return routes?.map((item) => {
      const {
        ...rest
      } = item;

      const Start = typeof item?.element === 'function' ?
        lazy(item.element) : item.element;

      const element = typeof item?.element === 'function' ? <Start /> : Start; 

      const children = rest?.children?.length ?
        createStationRouter(rest.children) : [];

      return {
        ...rest,
        element,
        ...(children?.length ? { children } : {}),
      }
    }) as RouteObject[];
  };
  

  const useLink = () => {
    const onLink = useNavigate();
    return (to: ResolvePaths<R> | number) => onLink(to);
  };

  const router = createBrowserRouter(
    createStationRouter(routes),
  );


  const station = {
    router,
    useLink,
  };


  return station;
};