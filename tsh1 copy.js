var express = require('express');
let bodyParser = require('body-parser');
const configObj = require("./config").config;
const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const port =3000

// 初始化链配置。
btsjsws.ChainConfig.networks["Tixonshare"] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id: "ed65e883f34d62fd9a036a37bf63ebdbabb20a72e2a6ee6ff1a22557a5c0e25c"
}


async function initRun() {
    await btsjsws.Apis.instance(configObj.ip, true).init_promise;
    // 连接到测试节点。
    await btsjs.ChainStore.init(false);
}

initRun().then(()=>{
    let main = require('./api/main');
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
        
        res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
        
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            
        next();
            
    });

    app.use('/',main);

    app.listen(port, function () {
        console.log('listen '+port+'...');
    });

   
}).catch(error=>{
   console.log('错误')
   let main = require('./api/main');
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
        
        res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
        
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            
        next();
            
    });

    app.use('/',main);

    app.listen(port, function () {
        console.log('listen '+port+'...');
    });


    console.log(error)

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('监听错误')
    });
})