import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export type EnterFn = () => boolean;

type Fn = (when: boolean) => void;

export type LeaveFn = (leave: Fn) => void;


export interface Router<R extends readonly Router<never[]>[]> {
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
   * @name children
   * @description 子路由
   */
  children?: Router<R>[];
}

export type BrowserRouter = ReturnType<typeof createBrowserRouter>;

export type BeforeRecord = {
  /**
   * @function enter
   * @description 全局路由前置守卫
  */
  enter?: EnterFn;
  /**
   * @function leave
   * @description 全局路由退出守卫
  **/
  leave?: LeaveFn;
}

export interface RouterStation<R extends readonly Router<never[]>[]> {
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
type ResultPaths<Path extends string, P extends string = ''> = Path extends `/${string}` ? ResolveId<Path> : ResolveId<`${P}/${Path}`>


export type ResolvePaths<T extends readonly Router<never[]>[], P extends string = ""> = T extends readonly (infer R)[]
  ? R extends { path: infer Path extends string; children?: infer Children }
  ? ResultPaths<Path, P>
  | (Children extends readonly Router<never[]>[] ?
    ResolvePaths<Children, ResultPaths<Path, P>> : never)
  : never
  : never;