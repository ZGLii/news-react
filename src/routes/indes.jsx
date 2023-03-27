import {Suspense, useState, useEffect} from 'react';
import {
  Routes,
  Route,
  useLocation,
  useParams,
  useSearchParams,
  useNavigate,
  Navigate
} from 'react-router-dom';
import {Mask, DotLoading, Toast} from 'antd-mobile';
import routes from './routes';
import store from '../store';
import action from '../store/action';
const Element = props => {
  const {component: Component, meta, path} = props;
  let [_, setRandom] = useState(0);
  /* 登录校验 */
  const isCheckLogin = path => {
    let {
        base: {info}
      } = store.getState(),
      // checkList 有权限限制的路由列表
      checkList = ['/personal', '/store', '/update'];
    return !info && checkList.includes(path);
  };
  //  isShow true不需要权限  false需要权限
  let isShow = !isCheckLogin(path);
  useEffect(() => {
    if (isShow) return;
    // 如果用户信息不存在
    // 1 刷新页面导致用户信息丢失   2 没有登录
    // 先调用接口去查询用户信息，如果携带的token能查到就则表示用户登录生效，否则验证失败
    /* 注意这里是异步操作，所以程序直接往后执行，会继续渲染路由组件 */
    (async () => {
      // 因为Element是一个组件，返回的必须是一个JSX，但是添加async后返回的就是Promise了
      let infoAction = await action.base.queryUserInfoAsync();
      let info = infoAction.info;
      if (!info) {
        // 如果还不存在则没登陆
        Toast.show({
          icon: 'fail',
          content: '请先登录'
        });
        // 跳转到登录页
        navigate(
          {
            pathname: '/login',
            search: `?to=${path}`
          },
          {replace: true}
        );
        return;
      }
      // 如果获取到了信息,说明是登录的,我们派发任务把信息存储到容器中
      store.dispatch(infoAction);
      // 由于这里没有使用react-redux所以状态修改不会自动派发更新
      setRandom(+new Date());
    })();
  });

  let {title = '知乎日报-WebApp'} = meta || {};
  document.title = title; // 当路由匹配上后修改页面标题
  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();
  return (
    <>
      {isShow ? (
        <Component navigate={navigate} location={location} params={params} usp={usp} />
      ) : (
        <Mask visible={true}>
          {/* 当网速较慢时就能体现其作用 */}
          <DotLoading color="white" />
        </Mask>
      )}
    </>
  );
};

export default function RouteView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true} opacity="thick">
          <DotLoading />
        </Mask>
      }
    >
      <Routes>
        {routes.map((item, index) => {
          let {name, path} = item;
          return <Route key={name} path={path} element={<Element {...item} />} />;
        })}
      </Routes>
    </Suspense>
  );
}