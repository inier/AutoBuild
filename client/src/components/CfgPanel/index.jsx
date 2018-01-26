// 设置dom 属性，data-type,data-url,data-title
// 状态 组件，dom 属性，有先后，关联 关系，data-type --> data-url --- >data-title
import React, { Component } from "react";
import { inject, observer } from 'mobx-react';
// import antd design 下拉框 和 input 组件
import { Form, Select, Input } from "antd";
import "./index.scss";
import DonePanel from "../DonePanel";

// 构造 下拉菜单  数据
// value data-type 的值，text  描述
import dataTypeArr from "./cfgData.json";

const FormItem = Form.Item;
const { TextArea } = Input;

// // 传入 props 数据
/**
 * {
 *  dataUrl,
 *  dataTitle,
 *  dataType,
 *  isInputUrl,
 *  isInputTitle
 *  inputUrlTip,
 *  
 * }
 * 
 * 
 * 
 */

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
class CfgPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.state = {
      cfgData: dataTypeArr,
      typeData: {
        url: ""
      }
    };
  };

  updateDragInfo(data) {
    this.store.updateDragCfg(this.store.dragOnId, data);
  }

  //组合下拉选项dom
  getOptionDom() {
    let children = [];
    this.state.cfgData.map((elm, idx) => {
      const tt = JSON.stringify(elm);
      children.push(<Select.Option
        value={tt}
        key={idx}
        searchVal={elm.text}
      >{elm.text}</Select.Option>);
    });
    return children;
  }
  // 下拉框 change 触发 事件
  handleSelectCg = (val) => {
    // 这里执行回调，刷新数据
    // val 得到的是 dataType 
    // / 这要设置 isInputUrl   isInputTitle

    const tt = this.state.typeData;
    this.setState(Object.assign(tt, JSON.parse(val)));
    this.updateDragInfo(JSON.parse(val));
  }
  // 输入框 change 
  handleInputCg = (e) => {
    const tType = e.target["data-type"];
    const tt = this.state.typeData;

    switch (tType) {
      case "url": {
        this.setState(Object.assign(tt, { url: e.target.value }));
        break;
      }
    }

    this.updateDragInfo({
      [tType]: e.target.value
    });
  }

  render() {
    let options = this.getOptionDom();
    return (
      <div className="cfgPanel" id={this.props.id}>
        <Form>
          {/* data-type 选择 */}
          <FormItem
            {...formItemLayout}
            label="*跳转类型："
          >
            <Select
              showSearch
              placeholder="选择跳转页面类型"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.searchVal.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%' }}
              value={this.state.typeData.dataType}
              onChange={this.handleSelectCg}>
              {options}
            </Select>
          </FormItem>
          {
            /* data-url */
            this.state.typeData.isInputUrl && (
              <FormItem
                {...formItemLayout}
                label="*跳转地址："
              >
                <TextArea
                  data-type="url"
                  placeholder={this.state.typeData.inputUrlTip}
                  onChange={this.handleInputCg}
                  value={this.state.url}
                  defaultValue={this.state.url}
                  autosize={{ minRows: 2, maxRows: 6 }} />
              </FormItem>
            )
          }

          {/* data-title */}
          {
            this.state.typeData.isInputTitle && (
              <FormItem
                {...formItemLayout}
                label="提示信息："
              >
                <TextArea
                  data-type="dataTitle"
                  placeholder="请输入模块的预留提示信息"
                  onChange={this.handleInputCg}
                  value={this.state.typeData.dataTitle}
                  defaultValue={this.state.typeData.dataTitle}
                  autosize={{ minRows: 4, maxRows: 6 }} />
              </FormItem>
            )
          }
        </Form>
      </div>
    );
  }
}
export default CfgPanel;
