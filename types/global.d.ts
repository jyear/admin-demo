declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

interface Window {}

type Method = 'get' | 'post';

interface Response {
  code: number;
  data: unknown;
  message: string;
}

interface ApiConfig {
  path: string;
  method: Method;
  config?: Record<string, any>;
}

interface MenuItem {
  label: string;
  children?: MenuItem[];
  path?: string;
  icon?: string | React.ReactElement;
  key?: string;
}

interface BaseComponentMap {
  input: React.ReactNode;
  checkbox: React.ReactNode;
  inputNumber: React.ReactNode;
  radio: React.ReactNode;
  rate: React.ReactNode;
  slider: React.ReactNode;
}

interface FullInputComponentMap extends BaseComponentMap {
  select: any;
  date: any;
  daterange: any;
}
