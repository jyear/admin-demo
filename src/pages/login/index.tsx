import { UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button';
import useCustomHooks from '@/hooks';
import './index.less';

const Login = () => {
  const { userLogin } = useCustomHooks();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<User.LoginParams>({
    mobile: '',
    code: '',
  });

  const loginClick = async () => {
    try {
      setLoading(true);
      const res = await userLogin(form);
      if (res) {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('userinfo', JSON.stringify(res));
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const formChange = res => {
    setForm(formData => ({ ...formData, ...res }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">钱包管理系统</div>
        <Form
          preserve={false}
          onValuesChange={formChange}
          className="login-container-form"
        >
          <Form.Item name="mobile">
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              size="large"
            ></Input>
          </Form.Item>
          <Form.Item name="code">
            <Input.Password
              prefix={<GoogleOutlined className="site-form-item-icon" />}
              placeholder="谷歌验证"
              size="large"
              type="password"
            ></Input.Password>
          </Form.Item>
        </Form>
        <div className="login-btn-box">
          <Button
            type="primary"
            className="login-btn"
            size="large"
            onClick={loginClick}
            loading={loading}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
