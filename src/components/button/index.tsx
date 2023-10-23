import { Button, ButtonProps } from 'antd';
import React from 'react';
import { throttle } from '@/utils/util';

interface Props extends ButtonProps {}

const CustomButton: React.FC<Props> = ({ type, ...props }) => {
  const curtomClick = throttle(
    (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (props.onClick && typeof props.onClick === 'function') {
        props.onClick(evt);
      }
    },
  );

  return (
    <Button type={type} onClick={curtomClick} {...props}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
