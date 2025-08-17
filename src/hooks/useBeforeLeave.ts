import { useContext, useEffect } from "react";
import { BeforeLeaveRouter, BlockerRouter } from "../utils/createBeforeRouter";
import type { LeaveFn } from "../types";
import { Blocker } from "react-router-dom";

type BeforeLeaveFn = {
  blocker?: Blocker;
};

/**
 * @function useBeforeLeave
 * @description 离开前置守卫
 * @param {LeaveFn} leave 
 * @returns {BeforeLeaveFn}
 */
export default function useBeforeLeave(leave: LeaveFn): BeforeLeaveFn {

  const before = useContext(BeforeLeaveRouter);
  const { blocker } = useContext(BlockerRouter);

  useEffect(() => {
    before.leaves?.push(leave);
    return () => {
      const index = before.leaves?.indexOf(leave) ?? -1;
      if (index !== -1) {
        before?.leaves?.splice(index, 1)
      }
    }
  }, []);

  return {
    blocker,
  };

}