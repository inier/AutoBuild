window.onload = function (){
    // _hmt.push(['_trackEvent', metions, action, str]);
    // 判断百度统计 是否 初始化完成
    // function addClickListen(){
    //     var btns = Array.from && Array.from(document.querySelectorAll('.btn')) || [].slice.call(document.querySelectorAll('.btn'));
    //     btns.forEach((elm,idx)=>{
    //         elm.addEventListener('click',function(){
    //             console.log(elm,'专题页 测试统计');
    //             var pageName = document.title;
    //             var action = '专题页点击——测试'
    //             statistics(pageName,action);
    //         })
    //     })
    // }
    // addClickListen();
    var btns = Array.from && Array.from(document.querySelectorAll('.btn')) || [].slice.call(document.querySelectorAll('.btn'));
    for(var i=0,len=btns.length;i<len;i++){
        btns[i].onclick=function (){
            //console.log('专题页 测试统计');
            var pageName = document.title;
            var action = '专题页点击'
            statistics(pageName,action);
        }
    }
    // function rollCheck(fn,condition,time){
    //     var timer = null;
    //     var time = time || 200;
    //     if(condition){
    //         fn();
    //     }else{
    //         clearTimeout(timer);
    //         timer = setTimeout(()=>{
    //             rollCheck();
    //         },time)
    //     }
    // }
    //var satisfyCont = window._hmt && Object.prototype.toString.call(window._hmt) === '[object Object]'
    //rollCheck(addClickListen,satisfyCont);
    // 统计代码 
    function statistics(pageName,action){
        // pageName  网页名称
        //, action,  事件统计
        //str  统计 字段 拼接
        var biz = request('biz') || '';
        var str = '';

        if(!biz){
            biz = 0;
        }
        str += 'biz='+biz+getUrlParams(['trail_channel_from','gp']);
        _hmt && _hmt.push(["_trackEvent", pageName, action, str])
        _paq && _paq.push(["trackEvent",pageName, action, str])
    }
    // 获得统计数据
    function getUrlParams(needParamArr){
        var str = ''
        Object.prototype.toString.call(needParamArr) === '[object Array]' && 
        needParamArr.length && 
        run(needParamArr);
        function run(arr){
            for(var j=0,len=arr.length;j<len;j++){
                var urlParam = request(arr[j]).split('#')[0];
                //  ie 8 不支持 window.atob
                if(arr[j] == 'tp' &&　window.atob){
                    urlParam = urlParam ? window.atob(urlParam) : '';
                }
                str += urlParam ? '&'+arr[j]+'='+urlParam : '';
            }
        }
        return str;
    }
    // 获取url 参数
    function request(paras) {
            var url = decodeURI(location.href);
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var returnValue;
            for (i = 0; i < paraString.length; i++) {
                var tempParas = paraString[i].split('=')[0];
                var parasValue = paraString[i].split('=')[1];
                if (tempParas === paras)
                    returnValue = parasValue;
            }
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
    }
}