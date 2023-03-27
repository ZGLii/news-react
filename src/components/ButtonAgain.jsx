import React, {useState} from 'react';
import {Button} from 'antd-mobile';
function ButtonAgain(props) {
  // 先克隆一份，将不需要属性提取出来只保留配置属性，然后统一进行传递
  let options = {...props};
  let {children, onClick: handle} = options;
  delete options.children;

  // 封装按钮点击点后的loading处理
  const [loading, setLoading] = useState(false);
  const clickHandle = async () => {
    setLoading(true);
    try {
      await handle();
    } catch (_) {}
    setLoading(false);
  };
  /* 重写onClick,不直接给所有标签都绑定click事件，解决handle没有传递的情况 */
  if (handle) {
    options.onClick = clickHandle;
  }
  return (
    <Button {...options} loading={loading}>
      {children}
    </Button>
  );
}

export default ButtonAgain;