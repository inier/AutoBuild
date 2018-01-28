import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Form, Input, Radio } from "antd";

import "./index.scss";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

@inject("UIStore")
@observer
class InfoPanel extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return (
      <Form>
        {/*专题页 类型 pc  app  */}
        <FormItem {...formItemLayout} label="专题类型：">
          <RadioGroup
            onChange={this.props.UIStore.onSetPageType}
            defaultValue={this.props.UIStore.pageType}
          >
            <RadioButton value="pc">PC端</RadioButton>
            <RadioButton value="app">APP端</RadioButton>
          </RadioGroup>
        </FormItem>

        {/* 网页 配置，名称，关键字，描述 */}
        <FormItem {...formItemLayout} label="网页标题：">
          <TextArea
            placeholder="请输入专题页 名称"
            onChange={this.props.UIStore.onSetPageTitle}
            value={this.props.UIStore.pageTitle}
            autosize={{ minRows: 1, maxRows: 2 }}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="网页关键字：">
          <TextArea
            placeholder="请输入专题页 关键字"
            onChange={this.props.UIStore.onSetPageKeyword}
            value={this.props.UIStore.pageKeyword}
            autosize={{ minRows: 2, maxRows: 4 }}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="网页描述：">
          <TextArea
            placeholder="请输入专题页 描述"
            onChange={this.props.UIStore.onSetPageDecription}
            value={this.props.UIStore.pageDescription}
            autosize={{ minRows: 3, maxRows: 8 }}
          />
        </FormItem>
      </Form>
    );
  }
}
export default InfoPanel;
