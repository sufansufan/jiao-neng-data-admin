import { reloadAuthorized } from './Authorized';

export const TOKEN_KEY = 'Authorization';

export const ROLE_CONFIG = [
  {
    label: '联动单位管理',
    value: '1',
    children: [
      {
        label: '联动单位列表',
        value: '1-1',
      },
      {
        label: '添加单位列表',
        value: '1-2',
      },
    ],
  },
  {
    label: '公司管理',
    value: '2',
    children: [
      {
        label: '公司列表',
        value: '2-1',
      },
      {
        label: '添加公司',
        value: '2-2',
      },
    ],
  },
  {
    label: '专家管理',
    value: '3',
    children: [
      {
        label: '专家列表',
        value: '3-1',
      },
      {
        label: '添加专家',
        value: '3-2',
      },
    ],
  },
  {
    label: '事件管理',
    value: '4',
    children: [
      {
        label: '事件列表',
        value: '4-1',
      },
      {
        label: '撤销上报',
        value: '4-2',
      },
      {
        label: '上报处理报告',
        value: '4-3',
      },
    ],
  },
];

export async function setToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
