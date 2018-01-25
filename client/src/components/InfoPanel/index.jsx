import React, { Component } from "react";
import { inject, observer } from 'mobx-react';
import { Form, Input, InputNumber, Radio } from 'antd';

import "./index.scss";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

@inject("UIStore")
@observer
class InfoPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
  }

  handleChangePageType = (e)=>{
    this.props.UIStore.onSetPageType(e);
  };

  handleChangePageTitle = (e)=>{
    this.props.UIStore.onSetPageTitle(e);
  };

  handleChangePageKeyword = (e)=>{
    this.props.UIStore.onSetPageKeyword(e);
  };

  handleChangePageDecription = (e)=>{
    this.props.UIStore.onSetPageDecription(e);
  };

  render(props) {
    return (
      <Form>
        {/*专题页 类型 pc  app  */}
        <FormItem
          {...formItemLayout}
          label="专题类型："
        >
          <RadioGroup
            onChange={this.handleChangePageType}
            defaultValue={this.store.pageType}>
            <RadioButton value="pc">PC端</RadioButton>
            <RadioButton value="app">APP端</RadioButton>
          </RadioGroup>
        </FormItem>

        {/* 网页 配置，名称，关键字，描述 */}
        <FormItem
          {...formItemLayout}
          label="网页标题："
        >
          <TextArea
            placeholder="请输入专题页 名称"
            onChange={this.handleChangePageTitle}
            value={this.store.pageTitle}
            autosize={{ minRows: 1, maxRows: 2 }} />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="网页关键字："
        >
          <TextArea
            placeholder="请输入专题页 关键字"
            onChange={this.handleChangePageKeyword}
            value={this.store.pageKeyword}
            autosize={{ minRows: 2, maxRows: 4 }} />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="网页描述："
        >
          <TextArea
            placeholder="请输入专题页 描述"
            onChange={this.handleChangePageDecription}
            value={this.store.pageDescription}
            autosize={{ minRows: 4, maxRows: 8 }} />
        </FormItem>
      </Form>
    );
  }
}
export default InfoPanel;
