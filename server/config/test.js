'use strict';
/**
 * 测试环境配置文件
 */
var config = {
    env: 'test', //环境名称
    host: "localhost", //服务器地址
    port: 8082,         //服务端口号
    mysql_config: {
        //mysql数据库配置
    },
    mongodb_config: {
        //mongodb数据库配置
    },
    redis_config: {
        //redis缓存配置
    },

};
module.exports = config;