import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BaseLayer from '@/layer/baseLayer';
import common from './common';
import home from './home';

const config: Array<RouteItem> = [...home, ...common];

const routesCfg: Array<RouteItem> = config.map(rout => {
  if (rout.useLayer) {
    const Element = rout.element;
    rout.element = <BaseLayer>{React.cloneElement(Element)}</BaseLayer>;
  }
  return rout;
});

const router = createBrowserRouter(routesCfg);

const routes = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default routes;
