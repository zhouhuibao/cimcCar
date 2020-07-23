const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const configObj = require("../config");

//根据账户id获取账户信息
function getUserByID(id){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance().db_api().exec("get_objects", [[id]]).then(userInfo => {
            resolve(userInfo)
        })

    })
}


module.exports = getUserByID;