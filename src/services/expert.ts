import request from '@/utils/request';

// 获取专家列表
export async function getTechnocracyList(params: object) {
  return request('/manage/getTechnocracyList', {
    method: 'POST',
    data: params,
  });
}

// 添加或者编辑专家信息
export async function addAndEditExpert(params: object) {
  return request('/manage/addAndEditExpert', {
    method: 'POST',
    data: params,
  });
}

// 删除专家
export async function deleteTechnocracyList(params: object) {
  return request('/manage/deleteTechnocracyList', {
    method: 'POST',
    data: params,
  });
}

// 专家管理-搜索框联想
export async function getTechnocracyListSearch(params: object) {
  return request('/manage/getTechnocracyListSearch', {
    method: 'POST',
    data: params,
  });
}
