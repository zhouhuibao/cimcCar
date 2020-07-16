// import getUser from './getUser'
const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");

// 初始化链配置。
btsjsws.ChainConfig.networks["Tixonshare"] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id: "ed65e883f34d62fd9a036a37bf63ebdbabb20a72e2a6ee6ff1a22557a5c0e25c"
}

// var {PrivateKey, key} = require("bitsharesjs");


// console.log(PrivateKey.fromSeed( key.normalize_brainKey('tixonshare') ))

// const nathanName = "tixonshare";
// const nathanKeyWif = "5K4Cij8gxaafBUHGn9cRNK5To541Vb5hta4vcqBmES8A2EjgQhs";
// const nathanKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


// console.log(nathanKey)

// const getuser = require("../utils/getAccuountByName");
const getTransaction = require("../api/getTransaction");
const getBalance = require("../api/getBalance");
const getAccount = require("../api/getAccount");
const getHeadBlockNumber = require("../api/getHeadBlockNumber");
const createAccount = require("../api/createAccount");
const transactionBuilder = require("../api/transactionBuilder");
const getBlockHash = require("../api/getBlockHash");
const getAccuountById = require("../utils/getAccuountById");

function main(req,response,next){

    const {params,method} = req.body

    switch (method) {
        case 'getbalance': // 获取账户余额
                getBalance(req,response,next)
            break;
        case 'getTransaction': // 根据区块高度获取交易信息
                getTransaction(req,response,next)
            break;
        case 'getAccount': // 获取用户信息
                getAccount(req,response,next)
            break;
        case 'headBlockNumber': // 获取区块高度
                getHeadBlockNumber(req,response,next)
            break;
        case 'createAccount': // 创建用户
                createAccount(req,response,next)
            break;
        case 'transactionBuilder':  // 转账
                transactionBuilder(req,response,next)
            break;
        case 'getblockhash':  // 根据区块高度获取历史记录
                getBlockHash(req,response,next)
            break;

        default:
            response.send({
                content:'方法不存在'
            })
            next()
            break;
    }

    

    
}


module.exports = main;
