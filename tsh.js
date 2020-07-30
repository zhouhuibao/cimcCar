var express = require('express');
let bodyParser = require('body-parser');
const configObj = require("./config").config;
const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const port = 3000

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



// 初始化链配置。
btsjsws.ChainConfig.networks[configObj.title] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id:configObj.chain_id
}
btsjsws.Apis.setAutoReconnect(true)

btsjsws.Apis.setRpcConnectionStatusCallback(status => {
    console.log("connection status:");
    console.log(status);
    console.log('断开时间'+new Date().toLocaleString());
    if(status !== 'open'){
        initRun()
    }
});


async function initRun() {
    await btsjsws.Apis.instance(configObj.ip, true).init_promise;
    // 连接到测试节点。
    await btsjs.ChainStore.init(false);
    console.log('重连时间'+new Date().toLocaleString() )

    console.log('初始化')
}

initRun()

app.use('/',main);

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

function logErrors (err, req, res, next) {
    console.error(err.stack,'日志错误')

    next(err)
}

function clientErrorHandler (err, req, res, next) {
    console.log('clientErrorHandle')
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
}

function errorHandler (err, req, res, next) {
    console.log('errorHandler')
    res.status(500)
    res.render('error', { error: err })
}

app.listen(port, function () {
    console.log('listen '+port+'...');
});