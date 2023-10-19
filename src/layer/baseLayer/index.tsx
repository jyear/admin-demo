import React from 'react';
import Header from '@/components/header';
import Side from '@/components/side';
import './index.less';

interface Props {
  children?: React.ReactElement;
}

const BaseLayer: React.FC<Props> = ({ ...props }) => {
  return (
    <div className="main">
      <Header></Header>
      <div className="main-container">
        <div className="main-container-side">
          <Side></Side>
        </div>
        <div className="main-container-plane">{props.children}</div>
      </div>
    </div>
  );
};
BaseLayer.displayName = 'BaseLayer';

export default BaseLayer;
