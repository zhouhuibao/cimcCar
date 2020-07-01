const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");

function getUser(account){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance("ws://34.227.217.98:33000", true).init_promise.then(res => {

            btsjsws.Apis.instance().db_api().exec("get_account_by_name", [account]).then(userInfo => {
                resolve(userInfo)
            })

            btsjsws.Apis.instance().db_api().exec("get_account_balances", [account,[]]).then(balance => {
                console.log(balance,'余额')
                // resolve(userInfo)
            })
        });
    })
}


module.exports = getUser;