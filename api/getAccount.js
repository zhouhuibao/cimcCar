const getAccuountByName = require("../utils/getAccuountByName");
const { isEmpty } = require("../utils/utils");

function getAccount (req,response,next){
    console.log('获取账户信息')

    let {params} = req.body
    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名',
        })
        next()
    }else{
        console.log(params)
        params =params.toLowerCase()
        getAccuountByName(params).then(res=>{
            if(res === null){
                response.send({
                    content:'账户不存在',
                })
            }else{
                const accountKey={
                    owner_key:res.owner.key_auths[0][0],
                    active_key:res.active.key_auths[0][0],
                    memo_key:res.options.memo_key
                }
                response.send({
                    content:accountKey,
                    msg:'main222'
                })
            }
            next()
        })
    }
    
}

module.exports = getAccount