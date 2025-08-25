import React, { ComponentType, createContext, LazyExoticComponent, useContext, useEffect, useRef, useState } from "react";
import { BlockerFunction, useBlocker } from "react-router-dom";
import { EnterFn, LeaveFn } from "../types";

interface BeforeRouterProps {
  children: React.ReactNode | LazyExoticComponent<ComponentType>;
}

export const BeforeLeaveRouter = createContext<{
  leaves?: (LeaveFn | void)[];
  enters?: (EnterFn | void)[];
}>({

});

/**
* @function BeforeRouterEnter 路由鉴权组件
* @param {BeforeRouterProps} props
* @returns {React.ReactNode}
*/
const BeforeEnterLeaveRouter = (props: BeforeRouterProps): React.ReactNode => {

  const {
    children,
  } = props;

  const {
    leaves,
    enters,
  } = useContext(BeforeLeaveRouter);

  const [enter, setEnter] = useState(false);

  const previous = useRef(leaves);

  // 确保所有 hooks 都按顺序执行，移除任何可能导致条件执行的逻辑
  const checkEnter = enters?.length;

  const Blocker: BlockerFunction = (params) => {

    if (!leaves?.length) {
      return false;
    }

    const {
      currentLocation,
      nextLocation,
    } = params ?? {};

    return currentLocation?.pathname !== nextLocation?.pathname
  };


  const blocker = useBlocker(Blocker);

  const onBlocker = async () => {
    if (blocker?.state === 'blocked') {
      /**
        * 所有守卫依次执行
       */
      const every: boolean[] = [];
      
      for (const leave of leaves ?? []) {
        const result = await (typeof leave === 'function' ? new Promise((resolve) => {
          leave?.(resolve);
        }) : Promise.resolve(true));
        every.push(result as boolean);
      }
      const predicate = every?.every(predicate => predicate);
      if (predicate) {
        // 放行
        blocker.proceed();
      } else {
        // 不放行
        blocker.reset();
      }
    }
  };

  // 始终调用 useEffect，避免条件性调用 Hook
  useEffect(() => {
    onBlocker();
  }, [blocker?.state]);

  /**
   * 所有守卫通过才会渲染组件
   */
  const createEnter = async () => {
    // 当没有前置守卫时，直接设置为已完成状态
    if (!checkEnter) {
      setEnter(true);
      return;
    }

    const deep = [];
    for (const enter of enters) {
      if (typeof enter !== 'function') {
        deep.push(true);
      } else {
        deep.push(await enter());
      }
    }
    const every = deep.every((item) => item);
    setEnter(every);
  };

  // 始终调用useEffect，避免条件性调用Hook
  useEffect(() => {
    createEnter();
  }, [location.pathname]);

  if (!enter) {
    return null;
  }

  return children as React.ReactNode;
};


export default function BeforeRouter(
  props: {
    children: React.ReactNode;
  },
): React.ReactNode {

  const before = useRef({
    enters: [],
    leaves: [],
  });

  return (
    <BeforeLeaveRouter.Provider value={before.current}>
      <BeforeEnterLeaveRouter>
        {props?.children}
      </BeforeEnterLeaveRouter>
    </BeforeLeaveRouter.Provider>
  );
}