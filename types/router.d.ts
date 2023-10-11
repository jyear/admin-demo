// import { IndexRouteObject } from 'react-router-dom';
///// <reference types="react-router-dom" />

interface RouteItem {
  useLayer: boolean;
  element: React.ReactElement;
  path: string;
  meta?: {
    title?: string;
  };
}
