var express = require('express');
let bodyParser = require('body-parser');
const configObj = require("./config").config;
const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const port = 3010

let main = require('./api/main');
const config = require('./config');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
    
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        
    next();
        
});

// 初始化链配置。
btsjsws.ChainConfig.networks[configObj.title] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id:configObj.chain_id
}


 function initRun() {
    btsjsws.Apis.instance(configObj.ip, true).init_promise.then(res=>{
        // 连接到测试节点。
        btsjs.ChainStore.init(false).then(initRes=>{
            app.use('/',main);
        }).catch(initErr=>{
            app.use('/',main);
            setTimeout(()=>{
                console.log('初始化错误')
                initRun()
            },1000)
        });
    }).catch(err=>{
        app.use('/',main);
        setTimeout(()=>{
            console.log('连接错误')
            initRun()
        },1000)
    })
    
}

initRun()

app.listen(port, function () {
    console.log(`listen ${port}...`);
}); 