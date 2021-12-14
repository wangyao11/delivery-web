import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/delivery_order/index'),
            meta: { title: '订单汇总', icon: 'dashboard' }
        }]
    },

    {
        path: '/user',
        component: Layout,
        redirect: '/user/table',
        children: [{
            path: 'table',
            name: 'Table',
            component: () =>
                import ('@/views/table/index'),
            meta: { title: '学校管理', icon: 'example' }
        }]
    },

    {
        path: '/delivery',
        component: Layout,
        redirect: '/delivery/list',
        children: [{
            path: 'list',
            name: 'delivery_list',
            component: () =>
                import ('@/views/delivery/index'),
            meta: { title: '配送管理', icon: 'nested' }
        }]
    },
    {
        path: '/product',
        component: Layout,
        redirect: '/product/list',
        meta: { title: '产品管理', icon: 'link' },
        children: [{
                path: 'list',
                name: 'product',
                component: () =>
                    import ('@/views/product/index'),
                meta: { title: '产品列表', icon: 'eye' }
            },
            {
                path: 'class',
                name: 'class',
                component: () =>
                    import ('@/views/productClass/index'),
                meta: { title: '产品分类', icon: 'tree' }
            }
        ]
    },
    {
        path: '/data',
        component: Layout,
        redirect: '/data/list',
        meta: { title: '数据统计', icon: 'data' },
        children: [{
            path: 'list',
            name: 'data',
            component: () =>
                import ('@/views/data/index'),
            meta: { title: '产品统计', icon: 'eye' }
        }]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router