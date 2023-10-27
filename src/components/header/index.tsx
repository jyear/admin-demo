import { UserOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import { useSelector } from 'react-redux';
import useCustomHooks from '@/hooks';
import './index.less';

const Header = () => {
  const userinfo = useSelector((state: Store.State) => state.user);
  const { sideType, type } = useSelector(
    (state: Store.State) => state.framework,
  );
  const { changeFrameworkSideType } = useCustomHooks();
  return (
    <div className="main-header">
      <div className="main-header-logo"></div>
      {type === 2 && (
        <div className="main-header-coll" onClick={changeFrameworkSideType}>
          {sideType === 1 && <MenuFoldOutlined className="main-side-trigger" />}
          {sideType === 2 && (
            <MenuUnfoldOutlined className="main-side-trigger" />
          )}
        </div>
      )}

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
