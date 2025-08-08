import { useContext, useEffect } from "react";
import { BlockerRouter } from "../utils/createBeforeRouter";
import type { LeaveFn } from "../types";


/**
 * @function useBeforeLeave
 * @param leave 
 */
export default function useBeforeLeave(leave: LeaveFn) {

  const before = useContext(BlockerRouter);

  useEffect(() => {
    before.leaves?.push(leave);
    
    return () => {
      const index = before.leaves?.indexOf(leave) ?? -1; 
      if (index !== -1) {
        before?.leaves?.splice(index, 1)
      }
    }
  }, []);

}