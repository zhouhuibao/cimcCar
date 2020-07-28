const btsjs = require("bitsharesjs");
const btsjsws = require("bitsharesjs-ws");
const configObj = require("../config");
const { isNumber,dataType } = require("../utils/utils");

// 根据区块高度，获取交易信息 1279263

function getTransaction(req,response,next){
    let {params} = req.body
    
    if(dataType(params) === 'Array'){
        params = Number(params.join(','))
    }
    console.log('根据区块高度获取交易信息')
    // console.log(params)

    if(!isNumber(params)){
        response.send({
            content:'请传入区块高度',
        })
        next()
    }else{
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
            // console.log("block " + params + " 不包含事务");
            response.send({
                content:null,
            })
            next()
        }
    }
    
} 

module.exports = getTransaction