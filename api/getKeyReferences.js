const btsjsws = require("bitsharesjs-ws");
const getAccuountById = require("../utils/getAccuountById");
const { dataType } = require("../utils/utils");


function getKeyReferences(req,response,next){
    let {params} = req.body
    
    if(dataType(params) === 'Array'){
        params = params.join(',')
    }
   
    btsjsws.Apis.instance().db_api().exec("get_key_references", [[params]]).then(res=>{
        const [[accountId]] = res
        getAccuountById(accountId).then(userInfo=>{
            if(userInfo === null){
                response.send({
                    content:'账户不存在',
                })
            }else{ 
                response.send({
                    content:userInfo[0].name,
                    msg:'main'
                })
            }
            next()
        })

    }).catch(error=>{
        response.send({
            content:'null',
            message:'公钥地址不存在'
        })
        next()
    })
     
    
} 

module.exports = getKeyReferences