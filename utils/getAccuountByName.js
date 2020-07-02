const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const configObj = require("../config");

//根据账户名获取账户信息
function getUser(account){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance(configObj.ip, true).init_promise.then(res => {

            btsjsws.Apis.instance().db_api().exec("get_account_by_name", [account]).then(userInfo => {
                resolve(userInfo)
            })

        });
    })
}


module.exports = getUser;