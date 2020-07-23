const getAccuountByName = require("../utils/getAccuountByName");
const { isEmpty } = require("../utils/utils");

function getAccount (req,response,next){
    console.log('获取账户信息')

    const {params} = req.body
    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名',
        })
        next()
    }else{
        getAccuountByName(params).then(res=>{
            if(res === null){
                response.send({
                    content:'账户不存在',
                })
            }else{
                response.send({
                    content:res,
                    msg:'main222'
                })
            }
            next()
        })
    }
    
}

module.exports = getAccount