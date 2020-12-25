import request from '@/utils/request';

// 获取接口列表
export async function getServicesList(params: object) {
  return request('/services', {
    method: 'GET',
    params,
  });
}

// 禁用启用接口
export async function switchState(id: string) {
  return request(`/services/${id}/disable`, {
    method: 'POST',
    data: {},
  });
}

// 添加接口
export async function addServices(params: object) {
  return request('/services', {
    method: 'POST',
    data: params,
  });
}

// 编辑接口
export async function editServices(id: string, params: object) {
  return request(`/services/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 获取资源列表
export async function getResourcesList(params: object) {
  return request('/resources', {
    method: 'GET',
    params,
  });
}
