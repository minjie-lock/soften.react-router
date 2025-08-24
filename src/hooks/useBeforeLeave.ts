import { useContext, useEffect } from "react";
import { BeforeLeaveRouter } from "../utils/createBeforeRouter";
import type { LeaveFn } from "../types";
import { To, useNavigate } from "react-router-dom";

type Options = {
  /**
   * @function onLeave
   * @description 导航离开，与 useLink 同理，但使用它不会被拦截
   * @returns 
   */
  onLeaveLink: (to: To) => Promise<boolean>;
};

/**
 * @function useBeforeLeave
 * @description 离开前置守卫
 * @param {LeaveFn} leave 
 * @returns {Options}
 */
export default function useBeforeLeave(leave: LeaveFn): Options {

  const before = useContext(BeforeLeaveRouter);

  const onLink = useNavigate();

  const unmount = () => {
    const index = before.leaves?.indexOf(leave) ?? -1;
    if (index !== -1) {
      before?.leaves?.splice(index, 1);
    }
  }

  useEffect(() => {
    before.leaves?.push(leave);
    return unmount;
  }, []);

  const onLeaveLink = async (to: To) => {
    const when = await new Promise<boolean>((resolve) => {
      unmount?.();
      resolve(true);
    });
    if (when) {
      onLink(to)
    };

    return when;
  }

  return {
    onLeaveLink,
  }
};