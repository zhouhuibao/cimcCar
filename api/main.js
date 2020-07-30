
const getTransaction = require("../api/getTransaction");
const getBalance = require("../api/getBalance");
const getAccount = require("../api/getAccount");
const getHeadBlockNumber = require("../api/getHeadBlockNumber");
const createAccount = require("../api/createAccount");
const transactionBuilder = require("../api/transactionBuilder");
const getBlockHash = require("../api/getBlockHash");
const getKeyReferences = require("../api/getKeyReferences");
const isPublicKeyRegistered = require("../api/isPublicKeyRegistered");
const getAccountByUserId = require("../api/getAccountById");

function main(req,response,next){

    console.log(new Date().toLocaleString() )

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
        case 'getAccountByUserId': // 根据用户id获取用户信息
                getAccountByUserId(req,response,next)
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
        case 'getKeyReferences':  // 根据key获取用户信息
                getKeyReferences(req,response,next)
            break;
        case 'isPublicKeyRegistered':  // 判断地址是否存在
                isPublicKeyRegistered(req,response,next)
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
