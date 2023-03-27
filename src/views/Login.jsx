import React, {useState, useEffect} from 'react';
import {Button, Form, Input, Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import action from '../store/action';
import './Login.less';
import ButtonAgain from '../components/ButtonAgain.jsx';
import NavBarAgain from '../components/NavBarAgain.jsx';
import api from '../api';
import _ from '../assets/utils';

/* 自定义表单校验规则 */
const validate = {
  phone(_, value) {
    value = value.trim();
    let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    // 必须以promise的形式返回
    if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
    if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
    return Promise.resolve();
  },
  code(_, value) {
    value = value.trim();
    let reg = /^\d{6}$/;
    if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
    if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
    return Promise.resolve();
  }
};
/* 延迟测试 */
const delay = (interval = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};
/* 延迟测试 */
function Login(props) {
  let {queryUserInfoAsync, navigate, usp} = props;
  const [formIns] = Form.useForm(), // 组件库提供获取form实例的方法
    [disabled, setDisabled] = useState(false),
    [sendText, setSendText] = useState('发送验证码');

  /* 内置提交按钮 */
  const submit = async values => {
    // 默认submit触发 此时表单校验已通过，values为每个表单得数据
    // 但是如果是自定义的click事件，需要自己添加校验规则
    try {
      await formIns.validateFields();
      let {phone, code} = formIns.getFieldsValue();
      // console.log(phone, code);
      let {code: codeHttp, token} = await api.login(phone, code);
      if (+codeHttp !== 0) {
        Toast.show({
          icon: 'fail',
          content: '登录失败'
        });
        formIns.resetFields(['code']);
        return;
      }
      // 登录成功:存储Token、存储登录者信息到redux、提示、跳转
      _.storage.set('tk', token);
      await queryUserInfoAsync(); //派发任务,同步redux中的状态信息
      Toast.show({
        icon: 'success',
        content: '登录/注册成功'
      });

      // navigate(-1); // 向后跳转
      let to = usp.get('to');
      // 由于客户端用户不可能直接进入login页所以不考虑
      to ? navigate(to, {replace: true}) : navigate(-1);
    } catch (_) {}
  };
  /* 发送验证码 */
  let timer = null,
    num = 31;
  const countdown = () => {
    num--;
    if (num === 0) {
      clearInterval(timer);
      timer = null;
      setSendText(`发送验证码`);
      setDisabled(false);
      return;
    }
    setSendText(`${num}秒后重新发送`);
  };
  const send = async () => {
    try {
      // 发送验证码之前先对手机号校验---表单校验为异步操作
      await formIns.validateFields(['phone']);
      let phone = formIns.getFieldValue('phone');
      let {code} = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: 'fail',
          content: '发送失败'
        });
        return;
      }
      setDisabled(true);
      countdown(); // 立即开启倒数
      if (!timer) timer = setInterval(countdown, 1000);
    } catch (_) {}
  };
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />
      <Form
        form={formIns}
        layout="horizontal"
        style={{'--border-top': 'none'}}
        initialValues={{phone: '', code: ''}}
        // onFinish={submit}
        footer={
          // ButtonAgain 内部处理了click事件不传递的情况
          // <ButtonAgain type="submit" color="primary">
          // 由于我们这里想添加loading效果，所以不能采用内部处理的方法
          <ButtonAgain color="primary" onClick={submit}>
            提交
          </ButtonAgain>
          // <Button type="submit" color="primary" loading={submitLoading}>
          //   提交
          // </Button>
        }
      >
        <Form.Item name="phone" label="手机号" rules={[{validator: validate.phone}]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          rules={[{validator: validate.code}]}
          extra={
            <ButtonAgain disabled={disabled} size="small" color="primary" onClick={send}>
              {sendText}
            </ButtonAgain>
            // <Button
            //   disabled={disabled}
            //   loading={sendLoading}
            //   size="small"
            //   color="primary"
            //   onClick={send}
            // >
            //   {sendText}
            // </Button>
          }
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}

export default connect(null, action.base)(Login);