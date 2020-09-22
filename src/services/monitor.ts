import request from '@/utils/request';

// 获取数据历史图表
export async function findHistory(params: object) {
  return request('/analysis/resources/history', {
    method: 'GET',
    params,
  });
}

// 获取异常日志列表
export async function findErrorLog(params: object) {
  return request('/analysis/resources/logs?type=ERROR', {
    method: 'GET',
    params,
  });
}

// 获取日志列表
export async function findLog(params: object) {
  return request('/analysis/resources/logs', {
    method: 'GET',
    params,
  });
}

// 获取接口图表
export async function findInterfaceHistory(params: object) {
  return request('/analysis/services/history', {
    method: 'GET',
    params,
  });
}

// 获取接口日志列表
export async function findInterfaceLog(params: object) {
  return request('/analysis/services/logs', {
    method: 'GET',
    params,
  });
}

// 获取接口频率日志
export async function findInterfaceTopLog(params: object) {
  return request('/analysis/services/top', {
    method: 'GET',
    params,
  });
}
