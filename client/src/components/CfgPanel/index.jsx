// 设置dom 属性，data-type,data-url,data-title
// 状态 组件，dom 属性，有先后，关联 关系，data-type --> data-url --- >data-title
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import antd design 下拉框 和 input 组件
import { Form, Select, Input,Switch  } from "antd";
import "./index.scss";

// 构造 下拉菜单  数据
// value data-type 的值，text  描述
import dataTypeArr from "./cfgData.json";

const FormItem = Form.Item;
const { TextArea } = Input;

// // 传入 props 数据
/**
 * {
 *  id 
 *  url,
 *  dataTitle,
 *  dataType,
 *  isSetTargetPage// 是否配置 领取 代金券 后再次跳转的页面
 *  typeData,// 配置 json 下拉款 配置项
 *
 *  },
 *  afterGetBratchData:{
 *    url,
 *    dataType,
 *    dataTitle,
 * 
 * }
 *
 *
 *
 */
//代金券页面使用详解：
// targetPage：配置该参数，则跳转到指定目标页；不配置，则返回上一页。
/**
 *  targetPage={
           dataType: 活动类型(必)
           dataUrl: 活动链接或者活动商品id(必)
           dataTitle: 活动title
           dataId: 活动id
       }
 * 
 * 
 */

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
class CfgPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    // 通过id  取得 当前操作的 点击区域
    // 初始化 
    
    // 需要state？
    this.state = {
      cfgData: dataTypeArr,
      typeData: {},
      url: ""
    };
  }

  //组合下拉选项dom 参数  option disabled 项;
  getOptionDom() {
    let children = [];
    this.state.cfgData.map((elm, idx) => {
      const tt = JSON.stringify(elm);
      children.push(
        <Select.Option value={tt} key={idx} searchVal={elm.text}>
          {elm.text}
        </Select.Option>
      );
    });
    return children;
  }
  // 下拉框 change 触发 事件
  handleSelectCg = val => {
    // 这里执行回调，刷新数据
    // val 得到的是 dataType
    const dataType = JSON.parse(val).value;
    this.store.setDragData({
      dataType:dataType
    });
    this.store.setDragData({typeData:JSON.parse(val)});
  };
  // 输入框 change
  handleInputCg = e => {
    const tType = e.target.getAttribute("data-type");
    //const tt = this.state.typeData;

    // switch (tType) {
    //   case "url": {
    //     this.setState(Object.assign(tt, { url: e.target.value }));
    //     break;
    //   }
    // }
    this.store.setDragData({
      [tType]: e.target.value
    });
  };
  // 开关========
  handleSwitch (val){
    console.log(val);
    this.store.setDragData({
      isSetTargetPage:val
    });
  }
  // 设置 领取代金券 后 跳转页面 type
  handleSelectCgForBrath = (val) => {
    // 组装 数据
    const sourceData = this.store.getDragItem(this.props.id);
    const temObj = sourceData.afterGetBratchData || {};
    temObj.typeData = JSON.parse(val);
    const dataType = temObj.typeData.value;
    this.store.setDragData({
      dataType:dataType
    });
    this.store.setDragData({afterGetBratchData:temObj});
  }
  // 处理 领取代金券 后 跳转页面 input
  handleInputCgForBrath = (e) => {
    const tType = e.target.getAttribute("data-type");
    const sourceData = this.store.getDragItem(this.props.id);
    const temObj = sourceData.afterGetBratchData || {};
    temObj[tType] = e.target.value;
    this.store.setDragData({
      afterGetBratchData: temObj
    });
  }
  render() {
    let options = this.getOptionDom();
    //为了 mobx 能监听 imgSrc 的变化 触发 render ，强行 引用值
    const test = this.props.UIStore.imgSrc;
    // 根据 点击区域id 获取 dataType 属性等。。。
    const sourceData = this.store.getDragItem(this.props.id);
    //  读取 配置项 的 值
    const typeData = sourceData.typeData || '选择跳转页面类型';
    const selecValue = Object.prototype.toString.call(typeData) === '[object Object]' && JSON.stringify(typeData) || typeData;
    // 是不是 代金券 页面 
    const isBatchId = typeData.targetPage || '';
    // 是不是设置 领取代金券的后的 目标页面 datatype datatitl 
    const isSetTargetPage = sourceData.isSetTargetPage || '';
    // 领取代金券后 跳转页面的配置参数
    const afterGetBratchData = sourceData.afterGetBratchData || '';
    // 领取代金券后 跳转页面的 typeData
    const bratch_select = afterGetBratchData.typeData || '选择领取代金券后跳转页面类型';
    const bratch_selectVal = Object.prototype.toString.call(bratch_select) === '[object Object]' && JSON.stringify(bratch_select) || bratch_select;
    //
    // this.store // 
    return (
      <div className="cfgPanel" id={this.props.id}>
        <Form>
          {/* data-type 选择 */}
          <FormItem {...formItemLayout} label="*跳转类型：">
            <Select
              showSearch
              placeholder="选择跳转页面类型"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.searchVal
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: "100%" }}
              value={selecValue}
              defaultValue = {selecValue}
              onChange={this.handleSelectCg}
            >
              {options}
            </Select>
          </FormItem>
          {/* data-url */
          typeData.isInputUrl && (
            <FormItem {...formItemLayout} label="*跳转地址：">
              <TextArea
                data-type="url"
                placeholder={typeData.inputUrlTip}
                onChange={this.handleInputCg}
                value={sourceData.url}
                defaultValue={sourceData.url}
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            </FormItem>
          )}

          {/* data-title */}
          {typeData.isInputTitle && (
            <FormItem {...formItemLayout} label="提示信息：">
              <TextArea
                data-type="dataTitle"
                placeholder="请输入模块的预留提示信息"
                onChange={this.handleInputCg}
                value={sourceData.dataTitle}
                defaultValue={sourceData.dataTitle}
                autosize={{ minRows: 4, maxRows: 6 }}
              />
            </FormItem>
          )}
          {/* 设置领取代金券 后 跳转地址 */}
          {
            isBatchId && (
              <div>
                <div>*配置领取代金券后 ,跳转地址</div>
                <Switch defaultChecked={false} onChange={this.handleSwitch.bind(this)} />
                {
                  isSetTargetPage && <FormItem {...formItemLayout} label="*跳转类型：">
                  <Select
                    showSearch
                    placeholder="选择跳转页面类型"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.searchVal
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: "100%" }}
                    value={bratch_selectVal}
                    defaultValue = {bratch_selectVal}
                    onChange={this.handleSelectCgForBrath}
                  >
                    {options}
                  </Select>
                </FormItem>                
                }
                {/* data-url */}
                {
                  isSetTargetPage && bratch_select.isInputUrl && (
                    <FormItem {...formItemLayout} label="*跳转地址：">
                      <TextArea
                        data-type="url"
                        placeholder={afterGetBratchData.inputUrlTip}
                        onChange={this.handleInputCgForBrath}
                        value={afterGetBratchData.url}
                        defaultValue={afterGetBratchData.url}
                        autosize={{ minRows: 2, maxRows: 6 }}
                      />
                  </FormItem>
                  )
                }
                {/* data-title*/}
                {
                  isSetTargetPage && bratch_select.isInputTitle && (
                    <FormItem {...formItemLayout} label="提示信息：">
                      <TextArea
                        data-type="dataTitle"
                        placeholder="请输入模块的预留提示信息"
                        onChange={this.handleInputCgForBrath}
                        value={afterGetBratchData.dataTitle}
                        defaultValue={afterGetBratchData.dataTitle}
                        autosize={{ minRows: 4, maxRows: 6 }}
                      />
                  </FormItem>
                  )
                }
              </div>
            )
          }
        </Form>
      </div>
    );
  }
}
export default CfgPanel;
