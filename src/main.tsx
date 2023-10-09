import ReactDOM from "react-dom/client";
import React from "react";
import App from "./app";

import "@/assets/less/reset.less";

const Root = ReactDOM.createRoot(document.querySelector("#root"));
Root.render(<App></App>);
