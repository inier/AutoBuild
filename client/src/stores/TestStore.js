import { observable, action, computed } from "mobx";
import ApiUrls from "../transport-layer/ApiUrl";
import { message } from "antd";
/**
 * 保存token等信息和其他UI相关，但是与业务无关的状态。
 */
class TestStore {
  constructor(rootStore, persistData) {
    this.rootStore = rootStore;
    this.persistData = persistData;  
    this.persistData.set("count", this);  
    this.persistData.set("nickName", this);
    this.persistData.set("mobile", this);  
    //初始值  
    this.setCount(0);
    this.setUserName("xxx");
    this.setMobile("xxxccccc");
  }

  // test
  @observable count = this.persistData.get("count", this); 
  @observable nickName = this.persistData.get("nickName", this);
  @observable mobile = this.persistData.get("mobile", this);

  //用户信息
  @computed get userInfo() {
    return {
      nickName: this.nickName,
      mobile: this.mobile
    };
  }

  setUserInfo(data) {
    Object.assign(this.userInfo, data);
  }
  setCount(count) {
    this.count = count;
  }

  @action
  setUserName(str) {
    this.nickName = str;
  }
  @action
  setMobile(str) {    
      this.mobile=str;  
  }

  @action
  increment() {
    let tCount = this.count;
    tCount++;
    this.setCount(tCount);
  }
  @action
  decrement() {
    let tCount = this.count;
    tCount--;
    this.setCount(tCount);
  }
  @computed
  get square() {
    return this.count * this.count;
  }
}
export default TestStore;
