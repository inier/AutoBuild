import { observable, action, computed } from 'mobx';
import ApiUrls from '../transport-layer/ApiUrl';
var _this;
/**
 * 保存token等信息和其他UI相关，但是与业务无关的状态。
 */
class UIStore {
  constructor(rootStore, persistData) {
    this.rootStore = rootStore;
    this.persistData = persistData;
    this.persistData.set('count', this);
    this.setCount(0);    
  }

  /**
   * 专题页面信息相关
   */

  @observable pageType = "pc"; // 网页 类型 app ，pc
  @observable pageTitle = ""; // 网页 title
  @observable pageKeyword = ""; // 网页 keyword
  @observable pageDescription = ""; // 网页 description

  @observable downloadUrl = ""; // 下载地址
  @observable previewUrl = ""; // 预览地址
  
  @observable imgSrc = [];  
  @observable floorOnId = "";
  @observable dragOnId = "";

  @observable imgList = [];
  @observable choosed = {};
  
  @action
  setPageData(data) {
    Object.assign(this, data);
  }

  // 选择 网页 类型 pc，app
  onSetPageType(e) {
    console.log('radio checked', e.target.value);
    this.setPageData({
      pageType: e.target.value
    });
   //this.setPageData2("pageType", e.target.value);
  }

  // 设置 生成网页 title
  onSetPageTitle(e) {    
    this.setPageData({
      pageTitle: e.target.value
    });
  }

  // 设置 生成网页 keyword
  onSetPageKeyword(e) {    
    this.setPageData({
      pageKeyword: e.target.value
    });
  }
  
  // 设置 生成网页 description
  onSetPageDecription(e) {    
    this.setPageData({
      pageDescription: e.target.value
    });
  }

  @action
  setDragData(floorOn, data){
    Object.assign(floorOn, data);
  }

  setDragid(id){
    this.dragOnId = id;
  }
  updateDragCfg(dragId, data){
    this.imgSrc.map((item, index)=>{
      if(item.id == this.floorOnId){
        item.map((it, idx)=>{
          if(it.id == dragId){
            this.setDragData(item, data);
          }
        });
      }
    });
  }
 

  /**
    * 提交构建数据接口
    * @param {*提交数据} data
    */
  DoneIt(data) {
    if (!data) {
      return;
    }
    return this.rootStore.sendPost(ApiUrls.DONE, data).then(
      result => {
        if (!result.data) return;
        console.log('Success');
        if (this.isMounted()) {
          console.log(result);
          if (result.result == 0 && result.data) {
            result.data.downloadUrl && this.setPageData({ downloadUrl: result.data.downloadUrl });
            result.data.previewUrl && this.setPageData({ previewUrl: result.data.previewUrl });
          }
        }
      },
      function (err, msg) {
        console.log(err);
        console.log(msg);
      }
    );
  }

  setChoosedImg(data) {
    this.setPageData(data);
  }


  // test
  @observable count = this.persistData.get('count', this);

  @action
  setCount(count) {
    this.count = count;
  }
  increment() {
    let tCount = this.count;
    tCount++;
    this.setCount(tCount);
  }
  decrement() {
    let tCount = this.count;
    tCount--;
    this.setCount(tCount);
  }
  @computed get
  square() {
    return this.count * this.count;
  }
}
export default UIStore;
