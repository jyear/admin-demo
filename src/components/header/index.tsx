import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import { useSelector } from 'react-redux';
import './index.less';

const Header = () => {
  const userinfo = useSelector((state: Store.State) => state.user);
  return (
    <div className="main-header">
      <div className="main-header-logo"></div>
      <div className="main-header-center"></div>
      <Avatar
        size="large"
        icon={<UserOutlined />}
        style={{ background: '#ccc', marginRight: '10px' }}
      ></Avatar>
      <span>{userinfo.username}</span>
      <Button type="text" style={{ color: 'red' }}>
        退出
      </Button>
    </div>
  );
};
export default Header;
