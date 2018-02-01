import { observable, action, computed } from "mobx";
import ApiUrls from "../transport-layer/ApiUrl";
import { message } from "antd";
/**
 * 保存token等信息和其他UI相关，但是与业务无关的状态。
 */
class UIStore {
  constructor(rootStore, persistData) {
    this.rootStore = rootStore;
    this.persistData = persistData;

    this.persistData.set("pageType", this);
    this.persistData.set("pageTitle", this);
    this.persistData.set("pageKeyword", this);
    this.persistData.set("pageDescription", this);
    //设置初始值
    // this.initData("pageType", "pc");
    // this.initData("pageTitle", "");
    // this.initData("pageKeyword", "");
    // this.initData("pageDescription", "");
  }

  /**
   * 专题页面信息相关
   */
  @observable pageType = this.persistData.get("pageType", this); // 网页 类型 app ，pc
  @observable pageTitle = this.persistData.get("pageTitle", this); // 网页 title
  @observable pageKeyword = this.persistData.get("pageKeyword", this); // 网页 keyword
  @observable pageDescription = this.persistData.get("pageDescription", this); // 网页 description

  @observable imgSrc = []; //选配数据集合
  @observable floorOnId = ""; //激活的楼层Id
  @observable dragOnId = ""; //激活的拖拽块Id

  @observable downloadUrl = ""; // 下载地址
  @observable previewUrl = ""; // 预览地址

  @action
  initData(key, value) {
    this[key] = value;
  }

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
    var pList = this.imgSrc.slice();
    var result = "";
    pList.forEach((item, pIndex) => {
      if (isPARENT) {
        if (item.id === id) {
          result = pIndex;
        }
        return false;
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
  getListItemIndex = id => {
    return this.getIndexById(id, true);
  };

  // List获取
  getListItem = id => {
    return this.imgSrc[this.getListItemIndex(id)];
  };

  // List更新
  setListItem = (data, floorId = this.floorOnId) => {
    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(floorId);
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        pList[pIndex][prop] = data[prop];
      }
    }

    this.updateRootData(this.imgSrc, pList);
  };

  //删除List中的指定项
  delListItem = id => {
    // 需要判断删除的 楼层中是不是 dragOnId
    const delFloorData = this.getListItem(id);
    const isFindDragdIdInDelData =
      (delFloorData.clkArr &&
        delFloorData.clkArr.length &&
        delFloorData.clkArr.filter((elm, idx) => {
          return elm.id === this.dragOnId;
        })) ||
      "";

    //var isFindDragdIdInDelData = !!this.getSubListItemIndex(this.dragOnId);
    isFindDragdIdInDelData.length && this.setDragId("");

    this.imgSrc.splice(this.getListItemIndex(id), 1);

    // 实时设置 floorOnId
    (!this.imgSrc.length || id == this.floorOnId) && this.setFloorOnId("");
  };

  // subList相关
  getSubListItemIndex = id => {
    return this.getIndexById(id);
  };
  /**
   * 获取clkArr中的列表项
   */
  getSubListItem = (id = this.dragOnId, parentId = this.floorOnId) => {
    if (!id) {
      return {};
    }
    if (!parentId) {
      message.error("该操作需要先选中楼层!");
      return;
    }

    const tResult = this.imgSrc.slice().filter((item, pIndex) => {
      return item.id === parentId;
    });
    if (tResult[0].clkArr === undefined) {
      return {};
    }
    return tResult[0].clkArr.filter((it, cIndex) => {
      return it.id === id;
    })[0];
  };

  setSubListItem = (data, id = this.dragOnId, parentId = this.floorOnId) => {
    if (!parentId) {
      message.error("该操作需要先选中楼层!");
      return;
    }

    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(parentId);
    var cIndex = this.getSubListItemIndex(id);

    if (pList[pIndex]["clkArr"]) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          typeof data[prop] != "undefined" &&
            (pList[pIndex]["clkArr"][cIndex][prop] = data[prop]);
        }
      }
    }

    this.imgSrc = pList;
  };
  //List的子级数据追加
  // genes: 为父->子的多级基因链,如  [pArr,cArr]
  // item: {k:v}
  addSubListItem = (data, parentId = this.floorOnId) => {
    if (!parentId) {
      message.error("该操作需要先选中楼层!");
      return;
    }
    var pList = [].concat(this.imgSrc.slice());

    var pIndex = this.getListItemIndex(parentId);
    if (typeof pList[pIndex].clkArr === "undefined") {
      pList[pIndex].clkArr = [];
    }
    this.pushListData(pList[pIndex].clkArr, data);

    this.imgSrc = pList;
  };

  delSubListItem = (id, parentId) => {
    if (!parentId) {
      message.error("该操作需要先选中楼层!");
      return;
    }
    var pList = [].concat(this.imgSrc.slice());
    var pIndex = this.getListItemIndex(parentId);
    var cList = pList[pIndex].clkArr;
    if (cList) {
      pList[pIndex].clkArr = cList.filter(it => {
        return it.id !== id;
      });
    }

    const tDragId = this.dragOnId;
    tDragId == id && this.setDragId("");

    this.imgSrc = pList;
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
  setFloorData = (data, id) => {
    this.setListItem(data, id);
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
      this.setFloorOnId("");
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
  getDragItem = id => {
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
  dragActive = (id, parentId = this.floorOnId) => {
    if (parentId !== this.floorOnId) {
      this.floorActive(parentId);
    }

    if (!(this.dragOnId && id === this.dragOnId)) {
      this.setDragId(id);
      // this.setSubListItem({
      //   isActive: !this.getDragItem(id).isActive
      // }, id, parentId);
    } else if (id === this.dragOnId) {
      //this.setDragId("");
      // this.setSubListItem({
      //   isActive: !this.getDragItem(id).isActive
      // }, id, parentId);
    }
  };

  @action
  delActiveDragBox = (id, parentId) => {
    this.delSubListItem(id, parentId);
  };

  @action
  setDownloadUrl = str => {
    this.downloadUrl = str;
  };

  @action
  setPreviewUrl = str => {
    this.previewUrl = str;
  };

  /**
   * 提交构建数据接口
   * @param {*提交数据} data
   */
  DoneIt(data) {
    if (!data) {
      message.error("请先确认传入的参数是否正确!");
      return;
    }
    return this.rootStore.sendPost(ApiUrls.DONE, data).then(
      result => {
        if (!result.data) return;
        //console.log("Success");
        //console.log(result);
        if (result.result == 0 && result.data) {
          result.data.downloadUrl &&
            this.setDownloadUrl(ApiUrls.BASE + result.data.downloadUrl);
          result.data.previewUrl &&
            this.setPreviewUrl(ApiUrls.BASE + result.data.previewUrl);
          message.success("构建完成！可直接预览或下载专题包，感谢使用！");
        }
      },
      function(err, msg) {
        //console.log(err);
        message.error(msg);
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
      function(err, msg) {
        console.log(err);
        console.log(msg);
      }
    );
  }
}
export default UIStore;
