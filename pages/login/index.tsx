import React from 'react';
import { history } from 'umi';
import { connect } from 'dva';

import LoginForm from './components/Login';
import styles from './style.less';

const { UserName, Password, Submit } = LoginForm;

const Login = (props: any) => {
  const { dispatch, user } = props;

  if (user.name) {
    history.push('/');
  }

  const handleSubmit = (values: Object) => {
    dispatch({
      type: 'user/fetchLogin',
      payload: values,
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm onSubmit={handleSubmit}>
        <UserName
          name="username"
          placeholder="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <Submit>登录</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ user }: any) => ({ user }))(Login);
