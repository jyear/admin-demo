import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import classNames from 'classnames';
import React, { useContext, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalContext from '@/context/global';
import useCustomHooks from '@/hooks';
import './index.less';

interface Props {
  showCollpose: boolean;
}

const Side = React.forwardRef<any, Props>(({ showCollpose = true }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sideType, type } = useSelector(
    (state: Store.State) => state.framework,
  );
  const { changeFrameworkSideType } = useCustomHooks();
  const globalContext = useContext(GlobalContext) as GlobalContext;
  const [curMenu, setCurMenu] = React.useState<string[]>([]);
  const [curOpen, setCurOpen] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return {};
  });

  React.useEffect(() => {
    doSetCur();
  }, [location]);
  React.useEffect(() => {
    if (sideType === 1) {
      setIsOpen(true);
    }
    if (sideType === 2 && type === 2) {
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
    if (sideType === 2 && type === 1) {
      setIsOpen(false);
    }
  }, [sideType]);

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
    if (type === 2) {
      changeFrameworkSideType();
    }
  };

  const openChange = res => {
    setCurOpen(res);
  };

  const toggleOpen = () => {
    changeFrameworkSideType();
    doSetCur();
  };

  return (
    <div
      className={classNames(
        'main-side',
        { mobile_side: type === 2 },
        { pc_side: type === 1 },
        { close: !isOpen },
      )}
    >
      <div
        className={classNames('main-side-menu', {
          'main-side-menu-type': sideType === 2,
        })}
      >
        <Menu
          items={renderMenus as any}
          theme="light"
          mode="inline"
          selectedKeys={curMenu}
          openKeys={curOpen}
          onClick={menuClick}
          onOpenChange={openChange}
          {...(type === 1 ? { inlineCollapsed: sideType === 2 } : {})}
        ></Menu>
      </div>
      <div className="main-side-ctrl">
        {showCollpose && (
          <div className="main-side-ctrl-coll" onClick={toggleOpen}>
            {sideType === 1 && (
              <MenuFoldOutlined className="main-side-trigger" />
            )}
            {sideType === 2 && (
              <MenuUnfoldOutlined className="main-side-trigger" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
Side.displayName = 'Side';

export default Side;
