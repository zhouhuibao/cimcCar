const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const configObj = require("../config");

// 获取区块高度
function headBlockNumber(req,response,next){
    let {params} = req.body
    console.log('获取区块高度')
    btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []).then(blockNumber=>{
        response.send({
            content:blockNumber
        })
        next()

    }).catch(error=>{
        response.send({
            content:null,
        })
        next()
    });
}


module.exports = headBlockNumber;