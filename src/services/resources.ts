import request from '@/utils/request';

// 获取公司列表
export async function getCompany() {
  return request('/companies', {
    method: 'GET',
  });
}

// 获取资源目录管理/资源目录列表
export async function getContentsList(params: object) {
  return request('/resources', {
    method: 'GET',
    params,
  });
}

// 获取资源目录管理/元数据录入检查表名存在
export async function isExistName(params: object) {
  return request('/exist/resources', {
    method: 'POST',
    data: params,
  });
}

// 获取资源目录管理/元数据录入添加元数据
export async function addResources(params: object) {
  return request('/resources', {
    method: 'POST',
    data: params,
  });
}

// 获取资源目录管理/元数据录入元数据类型
export async function dataType() {
  return request('/attr_types', {
    method: 'GET',
  });
}

// 获取资源目录管理/资源目录详情
export async function getdetails(id: any) {
  return request('/resources/' + id, {
    method: 'GET',
  });
}

// 获取资源目录管理/修改资源
export async function editResources(params: any, id: string) {
  return request('/resources/' + id, {
    method: 'PUT',
    data: params,
  });
}

// 手动后输入
export async function addInput(id: string, params: any) {
  return request('/import/resources/' + id + '/insert', {
    method: 'post',
    data: params,
  });
}

// 下载模板
export async function downloadTemplate(id: string) {
  return request('/template/resources/' + id + '/download', {
    method: 'post',
  });
}

// 上传
export async function uploadFile(id: string, params: any) {
  return request(`/import/resources/${id}/batch_insert`, {
    method: 'post',
    data: params,
  });
}

// 查看资源目录查询
export async function getResourceRows(params: any) {
  return request('/resource_rows', {
    method: 'GET',
    params,
  });
}

// 查看资源目录删除
export async function deleteResourceRows(params: any) {
  return request('/resource_rows/delete', {
    method: 'POST',
    data: params,
  });
}

// 查看资源目录更新
export async function updateResourceRows(params: any) {
  return request('/resource_rows/update', {
    method: 'POST',
    data: params,
  });
}
