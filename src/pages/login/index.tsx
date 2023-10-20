import { UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Apis from '@/apis';
import useCustomHooks from '@/hooks';
import './index.less';

const Login = () => {
  const { userLogin } = useCustomHooks();

  const getData = async () => {
    userLogin();
    const res = await Apis.User.getUserInfo();
    console.log(res);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">钱包管理系统</div>
        <Form className="login-container-form">
          <Form.Item>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              size="large"
            ></Input>
          </Form.Item>
          <Form.Item>
            <Input.Password
              prefix={<GoogleOutlined className="site-form-item-icon" />}
              placeholder="谷歌验证"
              size="large"
              type="password"
            ></Input.Password>
          </Form.Item>
        </Form>
        <div className="login-btn-box">
          <Button type="primary" className="login-btn" size="large">
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
