const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const configObj = require("../config");

// 获取余额
function getBalance(account){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance().db_api().exec("get_account_balances", [account,[]]).then(balance => {
            resolve(balance)
        }).catch(error=>{
            resolve(null)
        })
    })
}


module.exports = getBalance;