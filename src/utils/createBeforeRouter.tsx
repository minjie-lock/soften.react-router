import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Blocker, BlockerFunction, useBlocker, useLocation, useNavigate } from "react-router-dom";
import { EnterFn, LeaveFn } from "../types";

interface BeforeRouterProps {
  children: React.ReactNode;
}

export const BeforeLeaveRouter = createContext<{
  leaves?: (LeaveFn | void)[];
  enters?: (EnterFn<unknown> | void)[];
}>({});

export const BlockerRouter = createContext<{
  blocker?: Blocker;
}>({});


  /**
  * @function BeforeRouterEnter 路由鉴权组件
  * @param {BeforeRouterProps} props
  * @returns {React.ReactNode}
  */
  const BeforeRouter = (props: BeforeRouterProps): React.ReactNode => {

    const {
      children,
    } = props;

    const {
      leaves,
      enters,
    } = useContext(BeforeLeaveRouter);

    const [enter, setEnter] = useState(false);
    const to = useNavigate();
    const location = useLocation();

    // 确保所有 hooks 都按顺序执行，移除任何可能导致条件执行的逻辑
    const checkEnter = enters?.length;
    const checkLeave = leaves?.length;

    const Blocker: BlockerFunction = (params) => {
      const {
        currentLocation,
        nextLocation,
      } = params ?? {};

      return currentLocation?.pathname !== nextLocation?.pathname
    };

    // 始终调用 useBlocker，避免条件性调用 Hook
    const blocker = useBlocker(checkLeave ? Blocker : () => false);

    const onBlocker = async () => {
      if (blocker?.state === 'blocked') {
        // 只有在需要检查离开守卫时才执行检查
        if (checkLeave) {
          /**
           * 所有守卫依次执行
          */
          const every: boolean[] = [];
          for (const leave of leaves) {
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
        } else {
          // 没有离开守卫，直接放行
          blocker.proceed();
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
          deep.push(await enter(to));
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

    return (
      <BlockerRouter.Provider value={{ blocker }}>
        {children}
      </BlockerRouter.Provider>
    )
  };

export default function createBeforeRouter<R>(
  element: React.ReactNode,
  enters?: (EnterFn<R> | void)[],
  leaves?: (LeaveFn | void)[]
) {

  const before = {
    enters,
    leaves,
  };

  return (
    <BeforeLeaveRouter.Provider value={before}>
      <BeforeRouter>
        {element}
      </BeforeRouter>
    </BeforeLeaveRouter.Provider>
  );
}