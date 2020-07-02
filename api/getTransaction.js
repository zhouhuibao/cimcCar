const btsjs = require("bitsharesjs");
const btsjsws = require("bitsharesjs-ws");
const configObj = require("../config");
const { isNumber } = require("../utils/utils");

// 根据区块高度，获取交易信息 1279263

function getTransaction(req,response,next){
    const {params} = req.body

    if(!isNumber(params)){
        response.send({
            content:'请传入区块高度',
        })
        next()
    }else{
        btsjsws.Apis.instance(configObj.ip, true).init_promise.then(res => {
            try {
                btsjsws.Apis.instance().db_api().exec("get_transaction", [params, 0]).then(res=>{
                    response.send({
                        content:res,
                    })
                    next()
                }).catch(error=>{
                    response.send({
                        content:null,
                    })
                    next()
                })
            } catch (e) {
                console.log("block " + params + " 不包含事务");
                response.send({
                    content:null,
                })
                next()
            }
        });
    }
    
} 

module.exports = getTransaction