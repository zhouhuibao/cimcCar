// import getUser from './getUser'

// const getuser = require("../utils/getAccuountByName");
const getTransaction = require("../api/getTransaction");
const getBalance = require("../api/getBalance");
const getAccount = require("../api/getAccount");
const getHeadBlockNumber = require("../api/getHeadBlockNumber");
const createAccount = require("../api/createAccount");
const transactionBuilder = require("../api/transactionBuilder");

// getuser('nathan').then(res=>{
//     console.log(res,'账户信息')
// })

function main(req,response,next){

    const {params,method} = req.body

    console.log(method)

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
        default:
            response.send({
                content:'方法不存在'
            })
            next()
            break;
    }

    

    
}


module.exports = main;
