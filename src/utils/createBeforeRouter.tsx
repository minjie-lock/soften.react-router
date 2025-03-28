import React, { useEffect } from "react";
import { BlockerFunction, Navigate, useBlocker } from "react-router-dom";
import { EnterFn, LeaveFn } from "../types";

interface BeforeRouterProps {
  element: React.ReactNode;
}


export default function createBeforeRoute(
  element: React.ReactNode,
  enter?: EnterFn,
  leave?: LeaveFn
) {

  /**
  * @function BeforeRouterEnter 路由鉴权组件
  * @param {props} element
  * @returns {React.ReactNode | null}
  */
  const BeforeRouter = (props: BeforeRouterProps): React.ReactNode | null => {
    const {
      element
    } = props;

    const to = (path: string) => {
      return <Navigate to={path} />
    }
    const next = () => {
      return element;
    }

    const onBlocker = (location: Parameters<BlockerFunction>['0']) => {
      return location?.currentLocation?.pathname !== location?.nextLocation?.pathname
    }

    const blocker = useBlocker(onBlocker);

    useEffect(() => {
      if (blocker?.state === 'blocked') {
        if (typeof leave === 'function') {
          leave?.(
            blocker.proceed,
            blocker.reset,
          )
        } else {
          blocker.proceed();
        }
      }
    }, [blocker?.state])

    return typeof enter === 'function' ? enter(next, to) : element;
  };

  return <BeforeRouter element={element} />
}