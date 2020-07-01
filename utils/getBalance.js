const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");

function getBalance(account){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance("ws://34.227.217.98:33000", true).init_promise.then(res => {

            btsjsws.Apis.instance().db_api().exec("get_account_balances", [account,[]]).then(balance => {
                resolve(balance)
            }).catch(error=>{
                resolve(null)
            })
        });
    })
}


module.exports = getBalance;