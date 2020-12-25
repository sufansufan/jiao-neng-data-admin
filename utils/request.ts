import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';

import { getToken, removeToken, TOKEN_KEY } from '@/utils/authority';

/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: process.env.BASE_API,
  // credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器
request.interceptors.request.use((url, options) => {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers[TOKEN_KEY] = `Bearer ${token}`;
  }
  return {
    url,
    options: { ...options, headers },
  };
});

// response拦截器, 处理response
request.interceptors.response.use(
  async (response) => {
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
      return Promise.reject('网络异常');
    }
    if (response && response.status && response.status !== 200) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status } = response;
      notification.error({
        message: `请求错误 ${status}`,
        description: errorText,
      });
      return Promise.reject(errorText);
    }
    // if (response && response.status === 200) {
    //   return response;
    // }
    if(response.url.includes('download')) {
      return response;
    }
    const result = await response.json();
    if (result.error_code) {
      notification.error({
        message: result.msg,
        description: `本次操作未通过，请联系管理员 ${result.error_code}`,
      });
      // return Promise.reject(result.msg);
    }
    return result;

    // switch (error_code) {
    //   case 502:
    //     removeToken();
    //     history.push('/login');
    //     break;
    //   case 1002:
    //     // window?.g_app?._store?.dispatch({
    //     //   type: 'login/is404',
    //     //   payload: { msg },
    //     // });
    //     break;
    //   case 10000:
    //     return { data };
    //   default:
    // }
    // notification.error({
    //   message: msg,
    //   description: `本次操作未通过，请联系管理员 ${error_code}`,
    // });
    // return false;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default request;
