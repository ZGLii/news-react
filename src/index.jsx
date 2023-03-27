import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux';
import store from './store';
import {ConfigProvider} from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import 'lib-flexible';
import 'normalize.css';


import './index.less';
/* 处理最大宽度 */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    root.style.maxWidth = '750px';
    if (deviceW >= 750) {
      html.style.fontSize = '75px';
    }
  };
  handleMax();
  // 只是为了在模拟器看效果
  // 开发时切换窗口大小时，因为lib-flexible中也监听了窗口时间，而且还进行了延迟设置，所以会出现我们的设置被替换，但是不影响，真机中不存在窗口改变事件
  window.addEventListener('resize', handleMax);
})();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);