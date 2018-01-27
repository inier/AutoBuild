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
  updateObjData = (srcObj, data) => {
    Object.assign(srcObj, data);
  }

  //更新数组
  updateArrData = (srcArr, oldValue, newValue) => {
    srcArr.map((it, idx) => {
      if (it == "oldValue") {
        srcArr[idx] = newValue;
      }
    });
  }

  //追加数组
  pushArrData = (srcArr, data) => {
    srcArr.push(data);
  }

  //删除数组中的指定项
  delArrDataByIndex = (srcArr, index) => {
    srcArr.splice(index, 1);
  }

  // 选择 网页 类型 pc，app
  @action
  onSetPageType = (e) => {
    this.updateObjData(this, {
      pageType: e.target.value
    });
  }

  // 设置 生成网页 title
  @action
  onSetPageTitle = (e) => {
    this.updateObjData(this, {
      pageTitle: e.target.value
    });
  }

  // 设置 生成网页 keyword
  @action
  onSetPageKeyword = (e) => {
    this.updateObjData(this, {
      pageKeyword: e.target.value
    });
  }

  // 设置 生成网页 description
  @action
  onSetPageDecription = (e) => {
    this.updateObjData(this, {
      pageDescription: e.target.value
    });
  }
  // 楼层数组 imgSrc 追加数据
  @action
  floorDataPush = (obj) => {
    this.pushArrData(this.imgSrc, obj);
  }

  // 根据楼层id获得对应楼层的配置数据
  @action
  getFloorItem = (index) => {
    return this.imgSrc[index];
  }

  @action
  setChoosedImg = (data) => {
    this.imgSrc.map((item, idx) => {
      if (item.id == this.floorOnId) {
        this.updateObjData(item, data);
      }
    });
  }

  @action
  setFloorOnId = (id) => {
    this.updateObjData(this, {
      floorOnId: id
    });
  }
  @observable abc = false;
  @action
  floorActive = (id, index) => {
    if (!this.floorOnId && id != this.floorOnId) {
      console.log("Active Floor:"+ id + "- Index:"+ index);     
      this.setFloorOnId(id);
      // var tArr = [...observable(this.imgSrc).slice()];
      // console.log(tArr);
      // tArr[index].isActive = !this.abc;
      // this.imgSrc = tArr;
      //this.updateObjData(this.imgSrc, tArr);
      // var tArr = [...this.imgSrc];
      // this.updateObjData(tArr[index], {
      //   isActive: true
      // });
      // this.imgSrc = tArr;
    }


    // .map((item) => {
    //   if (item.id == this.floorOnId) {
    //     this.updateObjData(item, {
    //       isActive: true
    //     });        
    //   } else {
    //     this.updateObjData(item, {
    //       isActive: false
    //     });
    //   }
    // });
  }

  @action
  setDragId = (id) => {
    this.updateObjData(this, {
      dragOnId: id
    });
  }

  @action
  dragActive = (id) => {
    this.imgSrc.map((item) => {
      this.setDragId(id);
      if (item.id == this.floorOnId) {
        var clkArr = item.clkArr;
        clkArr.map((it, idx) => {
          if (it.id == this.dragOnId) {
            this.updateObjData(it, {
              isActive: true
            });
          } else {
            this.updateObjData(it, {
              isActive: false
            });
          }
        });
      }
    });
  }

  @action
  updateDragCfg = (data) => {     
    var tt = this.imgSrc.map((item) => {
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
    console.log(this.imgSrc);
    console.log(tt);
  }

  @action
  delActiveDragBox = () => {
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
