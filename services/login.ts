import request from '@/utils/request';

export async function userLogin(params: Object) {
  return request('/sessions', {
    method: 'POST',
    data: params,
  });
}

export async function getUserInfo(params: Object = {}) {
  return request('/users/profile', {
    method: 'GET',
    params,
  });
}
