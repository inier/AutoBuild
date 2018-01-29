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

  //更新对象
  updateRootData = (srcObj, data) => {
    Object.assign(srcObj, data);
  };

  //ListItem 读取
  getListItem = (list, id) => {
    return list[this.getListItemIndex(list, id)];
  };
  getListItemIndex = (list, id) => {
    var result;
    list.forEach((it, index) => {
      if (it.id === id) {
        result = index;
      }
    });
    return result;
  };
  //List更新
  setListItem = (list, data) => {
    list.slice().forEach((item, index) => {
      if (item.id === this.floorOnId) {
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            list[index][prop] = data[prop];
          }
        }
      }
    });
  };
  //List追加
  addListItem = (list, item) => {
    list.push(item);
  };
  //删除List中的指定项
  delListItem = (list, id) => {
    // list = list.slice().filter(it => {
    //   return it.id != id;
    //   //srcArr.splice(index, 1); //有bug
    // });
    list.splice(this.getListItemIndex(list, id), 1);
  };

  getSubListItem = (pListName, cListName) => {
    const tResult = this[pListName].slice().filter((item, pIndex) => {
      return item.id === this.floorOnId;
    });

    return tResult[0][cListName].filter((it, cIndex) => {
      return it.id === this.dragOnId;
    })[0];
  };
  //List的子级数据追加
  // genes: 为父->子的多级基因链,如  [pArr,cArr]
  // item: {k:v}
  addSubListItem = (pListName, cListName, data) => {
    var pList = this[pListName];
    pList.forEach((item, pIndex) => {
      if (item.id === this.floorOnId) {
        var cList = item[cListName];
        if (typeof cList == "undefined") {
          pList[pIndex][cListName] = [];         
        }
        this.addListItem(pList[pIndex][cListName], data);        
      }
    });
  };
  setSubListItem = (pListName, cListName, data) => {
    //var pList = this[pListName];
    var pList = [].concat(this[pListName].slice());
    console.log("更新前：");
    console.log(pList);
    pList.forEach((item, pIndex) => {
      if (item.id === this.floorOnId) {
        var cList = item[cListName];       
        if (cList) {
          cList.forEach((it, cIndex) => {
            if (it.id === this.dragOnId) {              
              for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                  pList[pIndex][cListName][cIndex][prop] = data[prop];
                }
              }
            }
          });         
        }
      }
    });
    this.imgSrc = pList;
    console.log("更新后：");
    console.log(pList);
  };
  delSubListItem = (pListName, cListName, data) => {
    var pList = [...this[pListName].slice()];
    console.log("更新前：");
    console.log(this[pListName]);
    pList.forEach((item, pIndex) => {
      if (item.id === data.parentId) {
        var cList = item[cListName];
        if (cList) {
          cList.forEach((it, cIndex) => {
            pList[pIndex][cListName] = cList.filter(it => {
              return it.id !== data.id;
            });
          });
        }
      }
    });
    this.updateRootData(this[pListName], pList);
    console.log("更新后：");
    console.log(this[pListName]);
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
    this.addListItem(this.imgSrc, obj);
  };

  // 根据楼层id获得对应楼层的配置数据
  @action
  getFloorItem = id => {
    return this.getListItem(this.imgSrc, id);
  };

  @action
  setFloorOnId = id => {
    this.updateRootData(this, {
      floorOnId: id
    });
  };

  @action
  setFloorData = data => {
    this.imgSrc.forEach((item, idx) => {
      if (item.id == this.floorOnId) {
        this.updateRootData(this.imgSrc[idx], data);
      }
    });
  };

  @action
  floorActive = (id, index) => {
    if (!(this.floorOnId && id === this.floorOnId)) {
      console.log("Active Floor:" + id + "- Index:" + index);
      this.setFloorOnId(id);

      this.setListItem(this.imgSrc, {
        isActive: true
      });
    } else if (id === this.floorOnId) {
      this.setListItem(this.imgSrc, {
        isActive: !this.getFloorItem(id).isActive
      });
      this.setFloorOnId("");
    }
  };

  @action
  delFloorItem = id => {
    this.delListItem(this.imgSrc, id);
  };

  @action
  getDragItem = id => {
    return this.getSubListItem("imgSrc", "clkArr");
  };

  @action
  setDragId = id => {
    this.updateRootData(this, {
      dragOnId: id
    });
  };
  
  @action
  addDragData = data => {
    this.addSubListItem("imgSrc", "clkArr", data);
  };

  @action
  setDragData = data => {
    this.setSubListItem("imgSrc", "clkArr", data);
  };

  @action
  dragActive = (id,parentId) => {
    if (!(this.dragOnId && id === this.dragOnId)) {
      this.floorActive(parentId);
      this.setDragId(id);
      
      // this.imgSrc.forEach((item) => {
      //   if (item.id == this.floorOnId) {
      //     var clkArr = item.clkArr;
      //     clkArr.forEach((it, idx) => {
      //       if (it.id == this.dragOnId) {
      //         this.updateRootData(it, {
      //           isActive: true
      //         });
      //       } else {
      //         this.updateRootData(it, {
      //           isActive: false
      //         });
      //       }
      //     });
      //   }
      // });
    }
  };

  @action
  delActiveDragBox = (id) => {
    this.delSubListItem("imgSrc", "clkArr", id);
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
          result.data.downloadUrl &&
            this.updateRootData({
              downloadUrl: result.data.downloadUrl
            });
          result.data.previewUrl &&
            this.updateRootData({
              previewUrl: result.data.previewUrl
            });
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
