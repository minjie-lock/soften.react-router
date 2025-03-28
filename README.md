# ask-router

_添加守卫的 React 路由_

```tsx

import { createRouter } from 'ask-router';

const router = createRouter([
  {
    path: '/home',
    element: (
      <div>home</div>
    ),
    beforeEnter: (next, to) => {
      /**
       * 执行 next 函数才会渲染组件
       */
      return next();
    }
  }
])

```