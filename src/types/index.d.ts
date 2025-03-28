
export type EnterFn = (
  next: () => React.ReactNode,
  to: (path: string) => React.ReactNode,
) => React.ReactNode;

export type LeaveFn = (
  proceed: () => void,
  reset: () => void,
) => void;


export interface Router {
  /**
   * @name path
   * @description 路径/路由地址
  */
  path: string;
  /**
   * @name element
   * @description 路由页面
  */
  element: React.ReactNode;
  /**
   * @function beforeRouteEnter
   * @description 进入页面前，可以在里面使用 hooks
   * @returns 
  */
  beforeEnter?: EnterFn;
  /**
   * @function beforeRouteLeave
   * @description 离开页面前，可以在里面使用 hooks
   * @returns 
   */
  beforeLeave?: LeaveFn;
  /**
   * @name children
   * @description 子路由
   */
  children?: Router[];
}


type ExtractPaths<T extends Router> =
  T extends { path: infer P; children: infer C }
  ? C extends Router[]
  ? P | ExtractPaths<C[number]>
  : P
  : never;