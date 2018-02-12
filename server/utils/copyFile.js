const fs = require('fs');
function copyFile(srcPath, tarPath) {
    // fs.readdir(srcPath,(err,files)=>{
    //     if(err){
    //         console.log(`文件路劲读取失败 传入路径+${srcPath}`);
    //     }
    //     for(let i=0;i<files.length;i++){
    //         fs.stat(srcPath+'/'+files[i],(err,data)=>{
    //             if(err){
    //                 console.log(`文件 fs。stat 失败 ${err}`);
    //             }
    //             // 判断文件夹？ 文件，文件直接复制，文件夹 复制文件夹
    //             //console.log('是不是文件夹'+data.isDirectory(),'是不是文件'+data.isFile());
    //             if(data.isFile()){// 文件
    //                 fs.copyFileSync(srcPath+'/'+files[i],tarPath+'/'+files[i]);
    //                 //复制文件
    //             }else{//文件夹
    //                 // 判断文件夹是不是存在 stat.isDirectory()
    //                 const stat = fs.readdir(tarPath+'/'+files[i],(err,file)=>{
    //                     if(err){
    //                         fs.mkdirSync(tarPath+'/'+files[i]);
    //                     }else{
    //                         fs.rmdirSync(tarPath+'/'+files[i]);
    //                     }
    //                     copyFile(srcPath+'/'+files[i],tarPath+'/'+files[i]);
    //                 })
    //             }
    //         })
    //     }
    // })
    //change code to sync
    const files = fs.readdirSync(srcPath);
    if (!files.length) console.log('copy over');
    for (let i = 0, len = files.length; i < len; i++) {
        const tPath = `${srcPath}/${files[i]}`;
        const cPath = `${tarPath}/${files[i]}`;
        const stat = fs.statSync(tPath);
        if (stat.isFile()) {// 文件
            fs.copyFileSync(tPath, cPath);
        } else {//文件夹
            // 判断文件夹是不是存在 stat.isDirectory()
            //let statT = fs.readdirSync(tPath);
            try {//没有
                let statT = fs.readdirSync(cPath);
                fs.rmdirSync(cPath);
            } catch (e) {
                fs.mkdirSync(cPath);
            }
            copyFile(tPath, cPath);
        }
    }
}

module.exports = copyFile;