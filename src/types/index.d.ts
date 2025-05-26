import { lazy } from 'react';
export type EnterFn<R> = (
  to: (to: ResolvePaths<R> | number) => void,
) => Promise<boolean> | boolean;

export type LeaveFn = (next: (result: boolean) => void) => void;


export interface Router<R> {
  /**
   * @name path
   * @description 路径/路由地址
  */
  path: string;
  /**
   * @name element
   * @description 路由页面
  */
  element: React.ReactNode | (() => Promise<{ default: ComponentType }>);
  /**
   * @function beforeRouteEnter
   * @description 进入页面前，可以在里面使用 hooks
   * @returns 
  */
  beforeEnter?: EnterFn<R>;
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
};

export type BrowserRouter = ReturnType<typeof createBrowserRouter>;

export type BeforeRecord<R> = {
  /**
   * @function enter
   * @description 全局路由前置守卫
  */
  enter?: EnterFn<R>,
  /**
   * @function leave
   * @description 全局路由退出守卫
  **/
  leave?: LeaveFn
}

export interface RouterStation<R extends readonly Router[]> {
  /**
   * @function beforeEnter
   * @description 全局前置路由守卫
   * @param enter 创建前调用
   * @param leave 退出前调用
  */
  beforeRouter: (before: BeforeRecord<R>) => void;
  router?: BrowserRouter;
  /**
   * @function useLink
   * @description 带有路径提示的路由航行
   * @returns toLink
   */
  useLink: () => (to: ResolvePaths<R> | number) => void;
}



type ResolveId<T extends string> =
  T extends `${infer Prefix}/:${infer Param}` ?
  T extends `${infer Prefix}/:${infer Param}?` ? `${Prefix}` | `${Prefix}/${string}` :
  `${Prefix}/${string}` : T;

// 如果是以 `/` 开头的路径，直接使用
// 否则拼接上父路径并添加 `/`
type ResultPaths<Path, P = ''> = Path extends `/${string}` ? ResolveId<Path> : ResolveId<`${P}/${Path}`>


export type ResolvePaths<T extends readonly Router[], P extends string = ""> = T extends readonly (infer R)[]
  ? R extends { path: infer Path extends string; children?: infer Children }
  ? ResultPaths<Path, P>
  | (Children extends readonly Router[] ?
    ResolvePaths<Children, ResultPaths<Path, P>> : never)
  : never
  : never;