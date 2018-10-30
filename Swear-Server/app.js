"use strict";
const express = require('express');
const config = require('./config');
const path = require('path');
const bodyParser = require('body-parser');
const utils = require('./utils/utils');
const {
    publishSwear,
    getMsg,
    msgCount
} = require('./utils/interaction');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

const {
    getClientIp,
    randomNumbers
} = utils;

// 设置全局响应头, 解决跨域问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    res.json({code: -1, msg: err.toString()})
});

/**
 * index
 */
app.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

/**
 * 同一ip， 一小时内只能发表一条誓言
 * @type {{}}
 */
const lastPublishTimestampCache = {};
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_HOUR = 1000 * 60 * 60;
function frequenceCheckError(clientIp) {
    const timestamp = lastPublishTimestampCache[clientIp];
    const current = new Date().getTime();
    if(timestamp && (current - timestamp < ONE_HOUR)){
        return true;
    }
    return false;
}

/**
 * 提交誓言:
 *      同一ip下, 一天最多可发1条誓言
 *      限制word最大和最小长度
 *      限制from最大长度
 */
app.post('/api/publish', (req, res) => {
    const body = req.body;
    console.log(body);

    const word = body.word;
    if(!word){
        res.json({code: -1, msg: 'fail', data: `内容不包含word字段`});
    }

    if(word.length === 0 || word.length > 500){
        res.json({code: -1, msg: 'fail', data: `内容长度 [${word.length}] 不在1-500个字符之间`});
        return;
    }

    const clientIp = getClientIp(req);
    console.log(`-> 发表誓言: ${clientIp}`);

    if(frequenceCheckError(clientIp)){
        res.json({code: -1, msg: 'fail', data: `您的IP：[${clientIp}] 在1小时内已发表过誓言, 请稍后再试！`});
        return;
    }

    const from = body.from || '';

    try {
        publishSwear(word, from)
            .then(result => {
                res.json({code: 0, msg: 'success', data: result});
                // console.log('把hash存起来');

                lastPublishTimestampCache[clientIp] = new Date().getTime();
            }).catch(e => {
            res.json({code: -1, msg: 'fail', data: e.toString()})
        });
    } catch (e) {
        res.json({code: -1, msg: 'fail', data: e.toString()})
    }

});

let data = [
    {index: 1001, data: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "0x111", 111]},
    {index: 1002, data: ["bbb", "0x222", 112]},
    {index: 1003, data: ["ccc", "0x333", 113]},
    {index: 1004, data: ["ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", "0x444", 114]},
    {index: 1005, data: ["eee", "0x555", 115]},
    {index: 1006, data: ["fff", "0x666", 116]},
];
/**
 * 获取誓言
 *
 */
app.get('/api/swears', (req, res) => {
    console.log('-> 获取誓言');

    const resultArr = msgArr.slice(0, 5);

    res.json({code: 0, msg: 'success', data: resultArr});

});

let msgArr = []; // 保留10个

const getRandomMsg = () => {
    return new Promise((resolve, reject) => {
        try {
            msgCount().then(count => {
                count = parseInt(count);
                if (count === 0) {
                    throw new Error('no data');
                }
                // 选取5个随机数
                const randomNums = randomNumbers(count, 5);
                console.log(`totalCount: ${count} randomNums: ${JSON.stringify(randomNums)}`);

                Promise.all(randomNums.map((val) => getMsg(val)))
                    .then(result => resolve(result))
                    .catch(e => console.error(e));

            }).catch(e => {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }

    })
};


function updateMsgArr() {
    console.log('开始获取誓言->');
    getRandomMsg().then(arr => {
        if(arr.length > 0){
            msgArr = msgArr.concat(arr);
            msgArr = msgArr.slice(-11);
        }
        // 去重复
        console.log('获取完毕->' + JSON.stringify(msgArr));
    }).catch( e => {console.error(e)});
}

// 10秒从区块链网络获取一次,定时选出0 -> 5个誓言
setInterval(() => {
    updateMsgArr();
}, 1000 * 5 * 2);

updateMsgArr();

/**
 *  监听合约数据变化
 *  redis缓存最新数据
 */


app.listen(config.PORT, '0.0.0.0');
console.log("区块链誓言后台服务运行中... 端口号: " + config.PORT);