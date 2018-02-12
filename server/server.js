// server.js


var crypto = require('crypto');
//var name = 'braitsch';
// var hash = crypto.createHash('md5').update(name).digest('hex');
// console.log(hash); // 9b74c9897bac770ffc029102a200c5de
// 创建一个服务器
var express = require('express');
var fs = require('fs');
var path = require("path");

var utils = require('./utils/utils');
// 解析 post 请求 参数
var bodyParser = require('body-parser');
// 引入 压缩插件v
var dozip = require('./utils/zip');
// zip.js test code
//dozip.dozip('autobuild/target/app');
var base64 = require('./utils/base64');
// 引入 生成 html 脚本 js
var build = require('./components/AutoBuild/index');
//var imgZone = require("./utils/imgZip");
var imgZone = require('./utils/imgCompress');

// 引入 复制文件 及文件夹 工具
const copyFile = require('./utils/copyFile');

//引入配置文件
var config = require('./config');
console.log('当前运行环境为：' + config.env);

// 服务器地址
var host = config.host || 'localhost';
// 将端口号设置为配置文件的端口号，默认值为8080
var port = utils.normalizePort(config.port || '8080');
// 打印输出端口号
//console.log('当前监听端口号为： ' + port);

var root = './build';
var downDIST = `./build`;
var autoBuildBasePath = './components/AutoBuild';

var app = express();

//limit:'30000kb'  设置 服务器 接受的 数据 大小限制
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '30000kb'
}));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  //res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => {
  var pathname = `${root}/index.html`;
  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end('<h1>404 Not Found</h1>');
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

//上传组件本地预览（不支持远程提交）
app.post('/postImgLocal', (req, res) => {
  res.send({ code: 200, msg: "post请求成功" });
})

app.use('/preview', express.static(path.join(__dirname, '/build')));

// app.get('/preview_pc/index.html',(req,res) => {
//   const hash = req.url.split('?')[1].split('=')[1];
//   console.log(hash);
//   const pathname = `./build/${hash}/pc/index.html`
//   app.use('/preview_pc', express.static(path.join(__dirname, `/build/${hash}/pc`)));
//   fs.readFile(pathname, (err, data) => {
//     if (err) {
//       res.writeHead(404, { "Content-Type": "text/html" });
//       res.end('<h1>404 Not Found</h1>');
//       console.log(err);
//     }
//     //res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(data);
//   });
// })

app.get('/*.js', (req, res) => {
  const path = req.path;
  console.log(path);
  fs.readFile(`${root}${path}`, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/javascript" })
      //res.end('<h1>404 Not Found</h1>')
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/javascript" })
    res.end(data);
  })
});

app.get('/*.css', (req, res) => {
  const path = req.path;
  console.log(path);
  fs.readFile(`${root}${path}`, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/css" })
      //res.end('<h1>404 Not Found</h1>')
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/css" })
    res.end(data);
  })
});

app.get('/get', (req, res) => {
  console.log(`请求 url:${req.path}`);
  console.log(`请求参数:${req.query}`);
  res.send('这是get');
});

app.post("/post", function (req, res) {
  console.log("请求参数：", req.body);
  var result = { code: 200, msg: "post请求成功" };
  res.send(result);
});

// 前台传过来的 数据，这里调用脚本，利用数据 生成 html
app.post('/getjson', (req, res) => {
  // 操作步奏，同步
  // 1 data 生成 hash，文件夹，如果这个文件夹 存在那么就跳过
  // 2,根据 生成专题页 类 生成 文件夹 pc 或则 app
  // 3，复制 基础文件 到 hash/pc(app) 文件夹
  // 4,根据 client 传过来的数据，生成 图片
  // 5，调用 生成专题页 工具 
  // 6,压缩图片
  // 7,给给 client 端 生成的 hash 

  //复制源基本路径
  const copyBasePath = './components/AutoBuild/public';
  //复制 目的 基本路径
  const targBasePath = './build';
  //console.log("请求参数：",req.body)
  var data = JSON.parse(req.body.data)
  
  // // 1-->pc,; 2-->app
  const isPc = Number(req.body.isPc) == 1;
  const pageType = isPc ? 'pc' : 'app';

  //根据 client 的数据 hash
  var dataHash = crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex');
  console.log(`根据布局数据 生成hash：${dataHash}`); // 9b74c9897bac770ffc029102a200c5de
  
  const hashPath = `${targBasePath}/${dataHash}`;
  // 利用catch 模块判断是不是 hash 文件的存在
  const isEisit = fs.existsSync(hashPath);
  if(isEisit){
    res.send({
      result: 0,
       data: {
            previewUrl: `/preview/${dataHash}/${pageType}/index.html`,
            downloadUrl: `/${pageType}.zip?hash=${dataHash}`,//'./app.zip'
            id:dataHash
          }
      })
    res.end();
  }else{
    fs.mkdirSync(hashPath);// build hash dir
    fs.mkdirSync(`${hashPath}/${pageType}`)// build pc or app dir
    // 复制基础文件 到 生成的 文件路径
    copyFile(`${copyBasePath}/${pageType}`,`${hashPath}/${pageType}`);

    
    
    //调用 工具生成 html，css
    const configData = {
      data: data,
      title: req.body.title || '',
      description: req.body.description || '',
      keyword: req.body.keyword || ''
    }

    const options = {
      hash:dataHash,
      pageType: pageType,
      configData: configData,
      callback: function (tPath) {
        
        console.log(`返回生成目标文件夹路径 :${hashPath}/${pageType}/index.html`)
        const zipOutFile = `${hashPath}/${pageType}`;

        // imgZone(`${tPath}/img`, `${tPath}/img`, {
        //   quality: '65-80'
        // }, function () {
        //   console.log("图片压缩成功！！");
        //   dozip.dozip(tPath, zipOutFile);
        // });
        imgZone(`${hashPath}/${pageType}/img`, `${hashPath}/${pageType}/img`, {
          quality: '65-80'
        }, function () {
          console.log("图片压缩成功！！");
          dozip.dozip(zipOutFile, zipOutFile);
        });
        res.send({
          result: 0,
          data: {
            previewUrl: `/preview/${dataHash}/${pageType}/index.html`,
            downloadUrl: `/${pageType}.zip?hash=${dataHash}`,//'./app.zip'
            id:dataHash
          }
        });
      }
    }
    //根据 base64 生成 图片
    base64.base642Img(data, isPc, `${hashPath}/${pageType}/img`,function (){
      build.buildHtml(options);
    });
    
  }
  // try{
  //   const isBuildfile = fs.readdirSync(hashPath);
  //   cosnole.log(`is this dir exisit ${isBuildfile}`);
  //   res.send({result: 0});
  // }catch(e){
  //   // 没有生成过，那么就直接生成
  //   fs.mkdirSync(hashPath);// build hash dir
  //   fs.mkdirSync(`${hashPath}/${pageType}`)// build pc or app dir
  // }
  
  //创建 文件夹 ===== autoBuildBasePath/build/dataHash
  // 1 判断 有没有build 文件夹，2 build 下面有没有相同的文件，有了相同hash这不重新生成，
  //const buildPath = `${autoBuildBasePath}/build`
  // 根据 hash 生成 hash 文件夹
  //const hashDirPath = `${buildPath}/${dataHash}`
  // 文件夹 存在？
  
  //const writePath = `${autoBuildBasePath}/img`;
 
  //base64.base642Img(data, isPc, writePath);



  // 调用模块，生成 文件
  //build.buildHtml(options);

});

// 编写 下载接口 
app.get('/app.zip', (req, res) => {
  console.log(req);
  // fs.readFileSync('./app.zip',(err,data)=>{
  //     res.send(data)
  // })
  // res.set({
  //     "Content-type":"application/octet-stream",
  //     "Content-Disposition":"attachment;filename="+encodeURI('./app.zip')
  // });
  // var fReadStream = fs.createReadStream('./app.zip');
  // fReadStream.on("data",function(chunk){res.write(chunk,"binary")});
  // fReadStream.on("end",function () {
  //     res.end();
  // });
  // 得到hash
  const hash = req.url.split('?')[1].split('=')[1];
  res.download(`${downDIST}/${hash}/app.zip`, function (err) {
    if (err) {
      console.log('下载app.zip文件失败');
    } else {
      console.log('下载app.zip文件成功');
    }
  })
});

app.get('/pc.zip', (req, res) => {
  const hash = req.url.split('?')[1].split('=')[1];
  res.download(`${downDIST}/${hash}/pc.zip`, function (err) {
    if (err) {
      console.log('下载pc.zip文件失败');
    } else {
      console.log('下载pc.zip文件成功');
    }
  })
});

// 设置 服务器端口号:port
// 主机名 ：host
app.listen(port, host, () => {
  console.log(`server is running http://${host}:${port}`);
});

