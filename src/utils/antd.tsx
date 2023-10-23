import * as Antd from 'antd';

export const componentMap: BaseComponentMap = {
  input: <Antd.Input />,
  checkbox: <Antd.Checkbox />,
  inputNumber: <Antd.InputNumber />,
  radio: <Antd.Radio />,
  rate: <Antd.Rate />,
  slider: <Antd.Slider />,
};

export const fullComponentMap: FullInputComponentMap = {
  input: <Antd.Input />,
  checkbox: <Antd.Checkbox />,
  inputNumber: <Antd.InputNumber />,
  radio: <Antd.Radio />,
  rate: <Antd.Rate />,
  slider: <Antd.Slider />,
  select: <Antd.Select />,
  date: <Antd.DatePicker />,
  daterange: <Antd.DatePicker.RangePicker />,
};
