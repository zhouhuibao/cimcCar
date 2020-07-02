const getBalance = require("../utils/getBalance");
// const getAccuountByName = require("../utils/getAccuountByName");
const { isEmpty } = require("../utils/utils");

function getBalanceFun (req,response,next){
    const {params} = req.body
    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名',
        })
        next()
    }else{
        // getAccuountByName(params).then(res=>{
        //     if(res=== null){
        //         response.send({
        //             content:'账户不存在'
        //         })
        //         next()
        //     }else{
                
        //     }
        // })

        getBalance(params).then(res=>{
            response.send({
                content:res,
            })
            next()
        })

        
    }
    
}

module.exports = getBalanceFun