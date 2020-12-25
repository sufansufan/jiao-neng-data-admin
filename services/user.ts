import request from '@/utils/request';

// 获取角色列表
export async function getRoleList(params: object) {
  return request('/user/getRoleList', {
    method: 'POST',
    data: params,
  });
}

// 添加、编辑角色列表
export async function addAndEditRole(params: object) {
  return request('/user/addAndEditRole', {
    method: 'POST',
    data: params,
  });
}

// 删除角色
export async function deleteRole(params: object) {
  return request('/user/deleteRole', {
    method: 'POST',
    data: params,
  });
}

// 角色管理-获取联想框
export async function findRoleListSearch(params: object) {
  return request('/user/findRoleListSearch', {
    method: 'POST',
    data: params,
  });
}

// 获取用户列表
export async function getUserList(params: object) {
  return request('/user/getUserList', {
    method: 'POST',
    data: params,
  });
}

// 编辑用户角色
export async function editUserRole(params: object) {
  return request('/user/editUserRole', {
    method: 'POST',
    data: params,
  });
}

// 获取用户联想
export async function getUserSearch(params: object) {
  return request('/user/getUserSearch', {
    method: 'POST',
    data: params,
  });
}
