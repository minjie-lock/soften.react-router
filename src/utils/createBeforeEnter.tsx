import React from 'react';
import { RouteObject, To, Navigate } from 'react-router-dom';

type InterceptionsRoutes = RouteObject[];

type toFn = (path: To) => React.ReactNode;

type nextFn = () => React.ReactNode | null;

type InterceptionPorps = {
  children: RouteObject['element'];
}
/**
 *  @function interceptionFn
 *  @param next 通行
 *  @param to 跳转其他页面
 *  @returns {next | to} 返回 next | to 任意一个
 */
type InterceptFn = (
  next: nextFn,
  to: toFn
) => React.ReactNode | null;

/**
 * @function createInterceptions 拦截
 * @param routes 
 * @param interceptionFn 
 * @returns 
 */
export default function createBeforeEnter(
  routes: InterceptionsRoutes,
  interceptionFn: InterceptFn
) {

  /**
   * @function Interceptions 路由鉴权组件
   * @param props element
   * @returns {React.ReactNode | null}
   */
  const Interception = (props: InterceptionPorps): React.ReactNode | null => {

    const {
      children
    } = props;
    const to = (path: To) => {
      return <Navigate to={path} />
    }

    const next = () => {
      return children;
    }
    
    return interceptionFn(next, to);
  }

  const NewInterceptionRoutes = routes.map((router) => {
    return {
      ...router,
      element: <Interception>{router.element}</Interception>
    }
  });

  return NewInterceptionRoutes;
}