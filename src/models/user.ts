import { getUserInfo, userLogin } from '@/services/login';
import { getToken, setToken } from '@/utils/authority';
import { history } from 'umi';

export default {
  namespace: 'user',
  state: {
    token: '',
    currentUser: {
      id: '',
      name: '',
    },
  },
  effects: {
    *fetchLogin({ payload, callback }: any, { call }: any) {
      const res = yield call(userLogin, payload);
      if (!res.error_code) {
        const { token } = res;
        yield setToken(token);
        history.push('/');
      }
    },
    *fetchUserInfo({ callback }: any, { call, put }: any) {
      const token = getToken();
      if (!token) return;
      const res = yield call(getUserInfo);
      if (res) {
        const { id, name } = res;
        yield put({
          type: 'saveUserInfo',
          payload: {
            token,
            currentUser: { id, name },
          },
        });
        if (typeof callback === 'function') callback();
      }
    },
  },
  reducers: {
    saveUserInfo(state: object, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
