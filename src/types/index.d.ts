
export type EnterFn<R> = (
  to: (path: R) => React.ReactNode,
) => Promise<boolean> | boolean;

export type LeaveFn = (next: (result: boolean) => void) => void;


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
  beforeEnter?: EnterFn<ResolvePaths<R>>;
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


export type ResolvePaths<T extends readonly Router[], P extends string = ""> = T extends readonly (infer R)[]
  ? R extends { path: infer Path extends string; children?: infer Children }
  ? (Path extends `/${string}`
    ? `${Path}` // 如果是以 `/` 开头的路径，直接使用
    : `${P}/${Path}`) // 否则拼接上父路径并添加 `/`
  | (Children extends readonly Router[] ? ResolvePaths<Children, Path extends `/${string}` ? Path : `${P}/${Path}`> : never)
  : never
  : never;