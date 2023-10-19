import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import classNames from 'classnames';
// import type { MenuProps } from 'antd/es/menu';
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalContext from '@/context/global';
import './index.less';

// <MenuFoldOutlined /> <MenuUnfoldOutlined />

const Side = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const globalContext = useContext(GlobalContext) as GlobalContext;
  const [curMenu, setCurMenu] = React.useState<string[]>([]);
  const [curOpen, setCurOpen] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  React.useEffect(() => {
    doSetCur();
  }, [location]);
  const doSetCur = () => {
    const curKey = globalContext.routPathMap[location.pathname].key as string;
    const keyArr = curKey ? curKey.split('_') : [];
    if (keyArr.length === 1) {
      setCurMenu([keyArr[0]]);
    }
    if (keyArr.length >= 2) {
      setCurOpen((cur: string[]) => [...cur, keyArr[0]]);
      setCurMenu([keyArr[0], `${keyArr[0]}_${keyArr[1]}`]);
    }
  };

  const renderMenus = React.useMemo(() => {
    return globalContext?.menus || [];
  }, [globalContext.menus]);

  const menuClick = ({ key }) => {
    const pathKey = key.toLocaleLowerCase();
    const { routKeyMap } = globalContext;
    navigate(routKeyMap[pathKey].path);
  };

  const openChange = res => {
    setCurOpen(res);
  };

  const toggleOpen = () => {
    setIsOpen((open: boolean): boolean => !open);
    doSetCur();
  };

  return (
    <div className={classNames('main-side', { close: !isOpen })}>
      <div className="main-side-menu">
        <Menu
          items={renderMenus as any}
          theme="light"
          mode="inline"
          selectedKeys={curMenu}
          openKeys={curOpen}
          onClick={menuClick}
          onOpenChange={openChange}
          inlineCollapsed={!isOpen}
        ></Menu>
      </div>
      <div className="main-side-ctrl">
        <div className="main-side-ctrl-coll" onClick={toggleOpen}>
          {isOpen && <MenuFoldOutlined className="main-side-trigger" />}
          {!isOpen && <MenuUnfoldOutlined className="main-side-trigger" />}
        </div>
      </div>
    </div>
  );
};

export default Side;
