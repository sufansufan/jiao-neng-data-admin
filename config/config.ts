import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import proxy from './proxy';

// https://umijs.org/config/
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/login',
          component: './login',
        },
        {
          component: './404',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/resources/contents',
            },
            {
              path: '/resources/',
              name: '资源目录管理',
              icon: 'table',
              routes: [
                {
                  path: '/resources/contents',
                  name: '资源目录',
                  component: './resources/contents',
                },
                {
                  path: '/resources/importData/:id',
                  name: '批量导入',
                  hideInMenu: true,
                  component: './resources/importData',
                },
                {
                  path: '/resources/see/:id',
                  name: '查看数据',
                  hideInMenu: true,
                  component: './resources/see',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              path: '/interface',
              name: '接口列表',
              icon: 'table',
              component: './interface',
            },
            {
              path: '/monitor/',
              name: '数据采集',
              icon: 'table',
              routes: [
                {
                  path: '/monitor/batch-collection',
                  name: '批量采集',
                  component: './monitor',
                },
                {
                  path: '/monitor/interface',
                  name: '接口服务',
                  component: './monitor/interface',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  history: { type: 'hash' },
  manifest: {
    basePath: '/',
  },
});
