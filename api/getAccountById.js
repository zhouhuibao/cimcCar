const getAccuountById = require("../utils/getAccuountById");
const { isEmpty } = require("../utils/utils");

function getAccuountByIds (req,response,next){
    console.log('根据账户ID获取账户信息')

    const {params} = req.body
    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名ID',
        })
        next()
    }else{
        getAccuountById(params).then(res=>{
            if(res === null){
                response.send({
                    content:'账户不存在',
                })
            }else{
                response.send({
                    content:res,
                })
            }
            next()
        })
    }
    
}

module.exports = getAccuountByIds