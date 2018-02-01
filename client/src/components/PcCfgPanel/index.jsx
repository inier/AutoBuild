// 设置 pc 的 链接
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Form,Input } from "antd";
const { TextArea } = Input;
const {FormItem} = Form.Item;
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
class PcCfgPanel extends Component{
    constructor(props) {
        super();
        this.store = props.UIStore;
    }
    handleInputCg=(e) => {
        const tType = e.target.getAttribute("data-type");
        this.store.setDragData({
            [tType]: e.target.value
          });
          const dragId = this.store.dragOnId;
          this.store.setDragId('');
          this.store.setDragId(dragId);
    }

    render(){
        // 根据 点击区域id 获取 dataType 属性等。。。
        const sourceData = this.store.getDragItem(this.props.UIStore.dragOnId);
        const url = sourceData && sourceData.url || '';
        const showUrl = url.indexOf('?') != -1 && url.split('?')[1].split('&')[0].split('=')[1] || '';
        return (
            <Form.Item {...formItemLayout} label="跳转链接：">
            <TextArea
                data-type="url"
                placeholder="请输入跳转页面的链接"
                onChange={this.handleInputCg}
                value={url}
                //defaultValue={url}
                autosize={{ minRows: 2, maxRows: 6 }}
                />
        </Form.Item>
        );
    }
}

export default PcCfgPanel;