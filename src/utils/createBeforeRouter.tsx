import React, { createContext, useCallback, useEffect, useState } from "react";
import { BlockerFunction, useBlocker, useLocation, useNavigate } from "react-router-dom";
import { EnterFn, LeaveFn } from "../types";

interface BeforeRouterProps {
  children: React.ReactNode;
}

export const BlockerRouter = createContext<{
  leaves?: (LeaveFn | void)[]
}>({});

export default function createBeforeRouter<R>(
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

    const [enter, setEnter] = useState(false);

    const to = useNavigate();
    const location = useLocation();

    if (!enters?.length) {
      return children
    }

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
    );

    useEffect(() => {
      onBlocker();
    }, [onBlocker]);

    /**
     * 所有守卫通过才会渲染组件
    */
    const createEnter = async () => {
      const deep = [];
      for (const enter of enters) {
        if (typeof enter !== 'function') {
          deep.push(true)
        }else{
          deep.push(await enter(to))
        }
      }
      const every = deep.every((item) => item);
      setEnter(every);
    }
    useEffect(() => {
      createEnter();
    }, [location.pathname]);

    if (enter) {
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