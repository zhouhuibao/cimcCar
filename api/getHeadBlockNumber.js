const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const configObj = require("../config");

// 获取区块高度
function headBlockNumber(req,response,next){
    return new Promise((resolve,reject)=>{
        btsjsws.Apis.instance(configObj.ip, true).init_promise.then(res => {

            btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []).then(blockNumber=>{
                response.send({
                    content:blockNumber,
                    msg:''
                })
                next()

            }).catch(error=>{
                response.send({
                    content:null,
                    msg:''
                })
                next()
            });
        });
    })
}


module.exports = headBlockNumber;