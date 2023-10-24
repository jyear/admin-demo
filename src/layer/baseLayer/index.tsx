import { Watermark } from 'antd';
import React from 'react';
import Header from '@/components/header';
import Side from '@/components/side';
import './index.less';

interface Props {
  children?: React.ReactElement;
}

const BaseLayer: React.FC<Props> = ({ ...props }) => {
  return (
    <Watermark
      style={{ height: '100%' }}
      {...{
        content: 'Ant Design',
        color: 'rgba(0, 0, 0, 0.01)',
        fontSize: 12,
        zIndex: 11,
        rotate: -22,
        gap: [100, 100],
      }}
    >
      <div className="main">
        <Header></Header>
        <div className="main-container">
          <div className="main-container-side">
            <Side></Side>
          </div>
          <div className="main-container-plane">{props.children}</div>
        </div>
      </div>
    </Watermark>
  );
};
BaseLayer.displayName = 'BaseLayer';

export default BaseLayer;
