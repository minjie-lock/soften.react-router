import React, { createContext, useCallback, useEffect } from "react";
import { BlockerFunction, Navigate, useBlocker } from "react-router-dom";
import { EnterFn, LeaveFn } from "../types";

interface BeforeRouterProps {
  children: React.ReactNode;
}

export const BlockerRouter = createContext<{
  leaves?: (LeaveFn | void)[]
}>({});

export default function createBeforeRouter<R extends string>(
  element: React.ReactNode,
  enters?: (EnterFn<R> | void)[],
  leaves?: (LeaveFn | void)[]
) {

  /**
  * @function BeforeRouterEnter 路由鉴权组件
  * @param {props}
  * @returns {React.ReactNode}
  */
  const BeforeRouter = (props: BeforeRouterProps): React.ReactNode => {

    const {
      children
    } = props;

    const to = (path: R) => {
      return <Navigate to={path} />
    }

    if (!enters?.length) {
      return children
    }

    /**
     * 所有守卫通过才会渲染组件
    */
    const every = enters.every((enter) => {
      if (typeof enter !== 'function') return true;
      return enter?.(to)
    });

    const Blocker: BlockerFunction = (location) => {
      const {
        currentLocation,
        nextLocation,
      } = location ?? {};

      return currentLocation?.pathname !== nextLocation?.pathname
    };

    const blocker = useBlocker(Blocker);

    const onBlocker = useCallback(
      async () => {
        if (blocker?.state === 'blocked') {
          if (!before?.leaves?.length) return blocker.proceed();
          /**
           * 所有守卫依次执行
          */
          const every: boolean[] = [];
          for (const leave of before.leaves) {
            const result = await (typeof leave === 'function' ? new Promise((resolve) => {
              leave?.(resolve);
            }) : Promise.resolve(true));
            every.push(result as boolean);
          }
          const predicate = every?.every(predicate => predicate);
          if (predicate) blocker.proceed(); else blocker.reset();

        }
      },
      [blocker?.state]
    )


    useEffect(() => {
      onBlocker();
    }, [onBlocker]);


    if (every) {
      return children
    }

  };


  const before = {
    enters,
    leaves,
  }



  return (
    <BlockerRouter.Provider value={before}>
      <BeforeRouter>
        {element}
      </BeforeRouter>
    </BlockerRouter.Provider>
  )
}