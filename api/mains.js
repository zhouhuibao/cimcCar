// import getUser from './getUser'
const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const getBalance = require("../utils/getBalance");

getuser('nathan').then(res=>{
    console.log(res,'账户信息')
})

getBalance('nathan').then(res=>{
    console.log(res,'账户余额')
})

function masin(req,response,next){

    console.log(req.body.params)
    const {params} = req.body

    btsjsws.Apis.instance("ws://34.227.217.98:33000", true).init_promise.then(res => {

        btsjsws.Apis.instance().db_api().exec("get_account_by_name", [params]).then(userInfo => {
            console.log(userInfo,'账户信息')
            response.send({
                content:userInfo,
            })
            next()
        })

        // const dgpo = await btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []);
        try {
            btsjsws.Apis.instance().db_api().exec("get_transaction", [1279263, 0]).then(res=>{
                console.log("不可逆发送：");
                console.log(res);
            });
            console.log("不可逆发送：");
            // console.log(tx);
        } catch (e) {
            console.log("block " + 1279263 + " 不包含事务");
            console.log(e);
        }
// getUser
      

    });
    // 1.2.81
    // 1.2.17
    
}


module.exports = masin;
