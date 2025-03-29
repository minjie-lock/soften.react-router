import { useContext, useEffect } from "react";
import { BlockerRouter } from "../utils/createBeforeRouter";
import type { LeaveFn } from "../types";

export default function useBeforeLeave(leave: LeaveFn) {

  const before = useContext(BlockerRouter);

  useEffect(() => {
    before.leaves?.push(leave);
  }, []);
}