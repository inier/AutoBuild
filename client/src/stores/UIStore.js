import { observable, action, computed } from 'mobx';
import ApiUrls from '../transport-layer/ApiUrl';

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

  //更新对象
  @action
  updateObjData = (srcObj, data) => {
    Object.assign(srcObj, data);
  }

  //更新数组
  @action
  updateArrData = (srcArr, oldValue, newValue) => {
    srcArr.map((it, idx) => {
      if (it == "oldValue") {
        srcArr[idx] = newValue;
      }
    });
  }

  //追加数组
  @action
  pushArrData = (srcArr, data) => {
    srcArr.push(data);
  }

  //删除数组中的指定项
  @action
  delArrDataByIndex = (srcArr, index) => {
    srcArr.splice(index, 1);
  }


  // 选择 网页 类型 pc，app
  onSetPageType = (e) => {
    console.log('radio checked', e.target.value);
    this.updateObjData(this, {
      pageType: e.target.value
    });
  }

  // 设置 生成网页 title
  onSetPageTitle(e) {
    this.updateObjData(this, {
      pageTitle: e.target.value
    });
  }

  // 设置 生成网页 keyword
  onSetPageKeyword(e) {
    this.updateObjData(this, {
      pageKeyword: e.target.value
    });
  }

  // 设置 生成网页 description
  onSetPageDecription(e) {
    this.updateObjData(this, {
      pageDescription: e.target.value
    });
  }

  floorDataPush(itemKey, obj) {
    this.pushArrData(this[itemKey], obj);
  }

  getFloorItem(id) {
    this.imgSrc.map((item, idx) => {
      if (item.id == id) {
        return item;
      }
    });
  }

  setChoosedImg(data) {
    this.imgSrc.map((item, idx) => {
      if (item.id == this.floorOnId) {
        this.updateObjData(item, data);
      }
    });
  }

  setFloorOnId(id) {
    this.updateObjData(this, {
      floorOnId: id
    });
  }

  floorActive(id){
    this.imgSrc.map((item) => {
      if(item.id == this.floorOnId){
        item.isActive = true;
        this.setFloorOnId(id);
      }else{
        item.isActive = false;
      }
    });
  }

  setDragId(id) {
    this.updateObjData(this, {
      dragOnId: id
    });
  }

  dragActive(id){
    this.imgSrc.map((item) => {
      if(item.id == this.floorOnId){
        var clkArr = item.clkArr;        
        clkArr.map((it, idx) => {
          if (it.id == this.dragOnId) {                     
            it.isActive = true;
            this.setDragId(id);
          }else{
            it.isActive = false;
          }
        }); 
      }     
    });
  }

  @action
  setDragData(floorOn, data) {
    Object.assign(floorOn, data);
  }

  updateDragCfg(data) {
    this.imgSrc.map((item) => {      
      if (item.id == this.floorOnId) {
        var clkArr = item.clkArr;
        if (clkArr) {
          clkArr.map((it, idx) => {
            if (it.id == this.dragOnId) {              
              this.updateObjData(it, data);
            }
          });
        }
      }
    });
  }

  delActiveDragBox() {
    this.imgSrc.map((item) => {
      console.log(item);
      if (item.id == this.floorOnId) {
        var clkArr = item.clkArr;
        if (clkArr) {
          clkArr.map((it, idx) => {
            if (it.id == this.dragOnId) {              
                this.delArrDataByIndex(clkArr, it);              
            }
          });
        }
      }
    });
  }

  updateDragInfo(data) {
    this.updateDragCfg(data);
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
            result.data.downloadUrl && this.updateObjData({ downloadUrl: result.data.downloadUrl });
            result.data.previewUrl && this.updateObjData({ previewUrl: result.data.previewUrl });
          }
        }
      },
      function (err, msg) {
        console.log(err);
        console.log(msg);
      }
    );
  }
}
export default UIStore;
