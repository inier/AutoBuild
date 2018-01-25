// 图片压缩
var glob = require('glob');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
// //图片处理
// imageMagick("图片源路径")
//     .resize(200, 0)     //设置压缩后的w/h
//     .setFormat('JPEG')
//     .quality(70)       //设置压缩质量: 0-100
//     .strip()
//     .autoOrient()
//     .write("压缩后保存路径",
//     function (err) { console.log("err: " + err); });
// //获取图片尺寸
// imageMagick("图片路径").size(function (err, value) { });
// //获取图片大小
// imageMagick("图片路径").filesize(function (err, value) { });

module.exports = (src, desc, opts, cb_success) => {
    var pattern = `${src}/*.jpg`;

    glob(pattern, {nodir: true}, function (err, files) {
        if(err){
            console.log(err);
        }
        else{
            console.log(files);
            
            files.forEach(function(item){
                var outputImage = imageMagick(item);
                //设置图片质量格式
                outputImage = outputImage.quality(opts.quantity).setFormat(opts.format);

                //写入图片
                outputImage.write(item, function (err) {
                    console.log("开始压缩...");
                    if (!err){
                        cb_success();
                    }else{
                        console.log(err);
                    }
                });
            });
        }
    });
}