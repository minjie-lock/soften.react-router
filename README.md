# @soften/react-router

_对 React Router 进行加法，添加类 Vue Router 的路由守卫功能_

## 安装
```bash
npm install @soften/react-router
```

## 使用

```tsx
import { createRouter, StationBrowserRouter } from '@soften/react-router';

const router = createRouter([
  {
    path: '/home',
    element: (
      <div>home</div>
    ),
  }
]);

function Root() {
  return (
    <StationBrowserRouter 
      router={router}
     />
  )
}
```

## 全局路由守卫
```tsx
import { createRouter, StationBrowserRouter } from '@soften/react-router';
const router = createRouter([
  {
    path: '/home',
    element: (
      <div>home</div>
    ),
  }
]);


router.beforeRouter({
  enter: () => {
    // 路由渲染前
    // 返回 true 函数执行渲染，false 则不渲染;
    return true;
  },
  leave: () => {
    // 路由离开前执行
    // 执行 proceed()函数执行离开，不执行则不离开;
    next();
  }
});
```

## 路由独享守卫

```tsx
import { createRouter, StationBrowserRouter } from '@soften/react-router';
const router = createRouter([
  {
    path: '/home',
    element: (
      <div>home</div>
    ),
    beforeEnter: (next, to) => {
    // 路由渲染前
    // 返回 true 函数执行渲染，false 则不渲染;
      return next();
    },
    berforeLeave: (next) => {
      // 路由离开前执行
      // 执行 next()传递参数 true 则执行离开 flase 则不离开;
      next(true);
    }
  }
]);
```

## 带路由路径枚举的航行器

_前提需要将参数路由地址设置为常量_

```tsx
import { createRouter, StationBrowserRouter } from '@soften/react-router';
const router = createRouter([
  {
    path: 'home',
    element: (
      <div>home</div>
    ),
  },
  {
    path: '/about',
    element: (
      <div>about</div>
    )
  }
] as const);

```

### 使用

_与 React Router 的 useNavigate 用法一致_

```tsx
const link = router.useLink();

link('/home')
```

## 组件里守卫

```tsx
import { useBeforeLeave } from '@soften/react-router';

function Home() {
  useBeforeLeave((next) => {
    // 路由离开前执行
    // 执行 next()传递参数 true 则执行离开 flase 则不离开;
    next(true);
  });

  return (
    <div>home</div>
  )
}
```

## 守卫执行顺序

_全局守卫 -> 路由独享守卫 -> 组件里守卫_

其实退出前守卫，本质上一个 Promise 链，每个守卫都返回一个 Promise，执行完后再执行下一个守卫，直到最后一个守卫。

当全部守卫传递的参数都为 true 时，才会执行离开。


## 注意事项

__路由守卫的执行顺序是按照路由的添加顺序执行的，所以路由的添加顺序很重要__