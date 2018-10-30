let path = require('path');

// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
let env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();

// 载入配置文件
let file = path.resolve(__dirname, env + '.js');
try {
    let config = module.exports = require(file);
    console.log('Load config: [%s] %s', env, file);
} catch (err) {
    console.error('Cannot load config: [%s] %s', env, file);
    throw err;
}