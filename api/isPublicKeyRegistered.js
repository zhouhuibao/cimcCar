const btsjsws = require("bitsharesjs-ws");
const { dataType } = require("../utils/utils");


function isPublicKeyRegistered(req,response,next){
    let {params} = req.body
    
    if(dataType(params) === 'Array'){
        params = params.join(',')
    }

    btsjsws.Apis.instance().db_api().exec("is_public_key_registered", [params]).then(res=>{
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
     
    
} 

module.exports = isPublicKeyRegistered