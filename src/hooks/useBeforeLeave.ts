import { useContext, useEffect, useRef } from "react";
import type { LeaveFn } from "../types";
import { To, useNavigate } from "react-router-dom";
import { BeforeLeaveRouter } from "@/components/before-router";

type Options = {
  leave?: {
    /**
     * @function push
     * @description 添加
     * @returns 
     */
    push: () => void;
    /**
    * @function pop
     * @description 删除
     * @returns 
    */
    pop: () => void;
    /**
     * @function link
     * @description 跳转
     * @returns 
     */
    link: (to: To) => void;
  }
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
  };

  const fn = {
    push: () => {
      before.leaves?.push(leave);
    },
    pop: () => {
      unmount?.();
    },
    link: onLeaveLink,
  }  

  return {
    leave: fn
  }
};