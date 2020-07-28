const getBalance = require("../utils/getBalance");
// const getAccuountByName = require("../utils/getAccuountByName");
const { isEmpty,dataType } = require("../utils/utils");

function getBalanceFun (req,response,next){
    const {params} = req.body
    console.log('获取余额')

    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名',
        })
        next()
    }else{

        let name=params
        if(dataType(params) === 'Array'){
            name=params.join(',')
        }
        name =name.toLowerCase()

        getBalance(name).then(res=>{
            let amount = null

            // console.log(res)

            if(dataType(res) === 'Null'){
                amount= null
            }else{
                if(res.length>0){
                    amount = res[0].amount
                }else{
                    amount = 0
                }
            }
            response.send({
                amount:amount,
            })
            next()
        })

        
    }
    
}

module.exports = getBalanceFun