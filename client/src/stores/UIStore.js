import { observable, action, computed } from "mobx";
import ApiUrls from "../transport-layer/ApiUrl";

/**
 * 保存token等信息和其他UI相关，但是与业务无关的状态。
 */
class UIStore {
  constructor(rootStore, persistData) {
    this.rootStore = rootStore;
    this.persistData = persistData;
    this.persistData.set("count", this);
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

  // 更新对象
  updateRootData = (srcObj, data) => {
    if (typeof srcObj !== "object" || Array.isArray(srcObj)) {
      srcObj = data;
    } else {
      Object.assign(srcObj, data);
    }
  };

  // push数据
  pushListData = (list, item) => {
    list.push(item);
  };

  // subList相关
  getIndexById = (id, isPARENT) => {
    var pList = [].concat(this.imgSrc.slice());
    var result = "";
    pList.forEach((item, pIndex) => {
      if (isPARENT) {
        if (item.id === id) {
          result = pIndex;
        }
      } else {
        var cList = item.clkArr;
        if (cList) {
          cList.forEach((it, cIndex) => {
            if (it.id === id) {
              result = cIndex;
            }
          });
        }
      }
    });
    return result;
  };

  //ListItem相关
  getListItemIndex = (id) => {
    return this.getIndexById(id, true);
  };

  // List获取 
  getListItem = (id) => {
    return this.imgSrc[this.getListItemIndex(id)];
  };

  // List更新
  setListItem = (data) => {
    if (!this.floorOnId) {
      return;
    };
    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(this.floorOnId);
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        pList[pIndex][prop] = data[prop];
      }
    }

    this.updateRootData(this.imgSrc, pList);
  };

  //删除List中的指定项
  delListItem = (id) => {
    // list = list.slice().filter(it => {
    //   return it.id != id;
    //   //srcArr.splice(index, 1); //有bug
    // });
    this.imgSrc.splice(this.getListItemIndex(id), 1);
  };

  // subList相关
  getSubListItemIndex = (id) => {
    return this.getIndexById(id);
  };
  /**
    * 获取clkArr中的列表项
    */
  getSubListItem = (id = this.dragOnId, parentId = this.floorOnId) => {
    if (!parentId) {
      return;
    };

    const tResult = this.imgSrc.slice().filter((item, pIndex) => {
      return item.id === parentId;
    });
    console.log(tResult);
    if (tResult[0].clkArr === undefined) {
      return {};
    }
    return tResult[0].clkArr.filter((it, cIndex) => {
      return it.id === id;
    })[0];
  };

  setSubListItem = (data, id = this.dragOnId, parentId = this.floorOnId) => {
    if (!parentId) {
      return;
    };

    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(parentId);
    var cIndex = this.getSubListItemIndex(id);

    if (pList[pIndex]["clkArr"]) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          pList[pIndex]["clkArr"][cIndex][prop] = data[prop];
        }
      }
    }
    this.updateRootData(this.imgSrc, pList);


    // var pList = [].concat(this.imgSrc.slice());    
    // pList.forEach((item, pIndex) => {
    //   if (item.id === parentId) {
    //     var cList = item["clkArr"];
    //     if (cList) {
    //       cList.forEach((it, cIndex) => {
    //         if (it.id === id) {              
    //           for (var prop in data) {
    //             if (data.hasOwnProperty(prop)) {
    //               pList[pIndex]["clkArr"][cIndex][prop] = data[prop];
    //             }
    //           }
    //         }
    //       });         
    //     }
    //   }
    // });
    // this.imgSrc = pList;
  };
  //List的子级数据追加
  // genes: 为父->子的多级基因链,如  [pArr,cArr]
  // item: {k:v}
  addSubListItem = (data) => {
    if (!this.floorOnId) {
      return;
    };
    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(this.floorOnId);

    if (typeof pList[pIndex].clkArr === "undefined") {
      pList[pIndex].clkArr = [];
    }
    this.pushListData(pList[pIndex].clkArr, data);
  };

  delSubListItem = (id = this.dragOnId, parentId = this.floorOnId) => {
    if (!parentId) {
      return;
    };
    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(parentId);
    var cList = pList[pIndex].clkArr;
    if (cList) {
      pList[pIndex].clkArr = cList.filter(it => {
        return it.id !== id;
      });
    }
    this.updateRootData(this.imgSrc, pList);
  };

  // 选择 网页 类型 pc，app
  @action
  onSetPageType = e => {
    this.updateRootData(this, {
      pageType: e.target.value
    });
  };

  // 设置 生成网页 title
  @action
  onSetPageTitle = e => {
    this.updateRootData(this, {
      pageTitle: e.target.value
    });
  };

  // 设置 生成网页 keyword
  @action
  onSetPageKeyword = e => {
    this.updateRootData(this, {
      pageKeyword: e.target.value
    });
  };

  // 设置 生成网页 description
  @action
  onSetPageDecription = e => {
    this.updateRootData(this, {
      pageDescription: e.target.value
    });
  };

  // 楼层数组 imgSrc 追加数据
  @action
  floorDataPush = obj => {
    this.pushListData(this.imgSrc, obj);
  };

  // 根据楼层id获得对应楼层的配置数据
  @action
  getFloorItem = id => {
    return this.getListItem(id);
  };

  @action
  setFloorOnId = id => {
    this.floorOnId = id;
  };

  @action
  setFloorData = data => {
    this.setListItem(data);
  };

  @action
  floorActive = (id, index) => {
    if (!(this.floorOnId && id === this.floorOnId)) {
      console.log("Active Floor:" + id + "- Index:" + index);
      this.setFloorOnId(id);
      // this.setListItem({
      //   isActive: true
      // });
    } else if (id === this.floorOnId) {
      //this.setFloorOnId("");
      // this.setListItem({
      //   isActive: !this.getFloorItem(id).isActive
      // });
    }
  };

  @action
  delFloorItem = id => {
    this.delListItem(id);
  };

  @action
  getDragItem = (id) => {
    return this.getSubListItem(id);
  };

  @action
  setDragId = id => {
    this.updateRootData(this, {
      dragOnId: id
    });
  };

  @action
  addDragData = data => {
    this.addSubListItem(data);
  };

  @action
  setDragData = (data, id, parentId) => {
    this.setSubListItem(data, id, parentId);
  };

  @action
  dragActive = (id, parentId) => {
    if (this.floorOnId !== parentId) {
      this.floorActive(parentId);
    }
    if (!(this.dragOnId && id === this.dragOnId)) {
      this.setDragId(id);
      // this.setSubListItem({
      //   isActive: !this.getDragItem(id).isActive
      // }, id, parentId);
    }
    else if (id === this.dragOnId) {
      //this.setDragId("");
      // this.setSubListItem({
      //   isActive: !this.getDragItem(id).isActive
      // }, id, parentId);
    }
  };

  @action
  delActiveDragBox = (id) => {
    this.delSubListItem(id);
  };

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
        console.log("Success");
        console.log(result);
        if (result.result == 0 && result.data) {
          result.data.downloadUrl && (this.downloadUrl = result.data.downloadUrl);
          result.data.previewUrl && (this.previewUrl = result.data.previewUrl);
        }
      },
      function (err, msg) {
        console.log(err);
        console.log(msg);
      }
    );
  }

  upload2Remote(data) {
    if (!data) {
      return;
    }
    return this.rootStore.sendPost(ApiUrls.UPLOADIMG, data).then(
      result => {
        if (!result.data) return;
        console.log("Success");
        console.log(result);
        if (result.result == 0 && result.data) {
        }
      },
      function (err, msg) {
        console.log(err);
        console.log(msg);
      }
    );
  }

  // test
  @observable count = this.persistData.get("count", this);

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
  @computed
  get square() {
    return this.count * this.count;
  }
}
export default UIStore;
