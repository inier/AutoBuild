const { injectBabelPlugin } = require('react-app-rewired');

// 使用你自己的 ESLint
function eslintRc(config){  
  let eslintLoader = config.module.rules[0];
  eslintLoader.use[0].options.useEslintrc = true;
}

// Add the SASS loader second-to-last
function sassRc(config){
  // (last one must remain as the "file-loader")
  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });
}

module.exports = function override(config, env) {
    //decorator,要放最前面
    config=injectBabelPlugin('transform-decorators-legacy',config);
    //add antd
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
    //正式环境下用cheap-module-source-map
    if(env === "production")config.devtool='cheap-module-source-map';

    eslintRc(config);
    sassRc(config);

    return config;
  };