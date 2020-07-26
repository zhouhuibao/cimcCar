const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getAccuountById = require("./getAccuountById");
const { dataType } = require("./utils");
const configObj = require("../config").config;

const nathanName = configObj.name;
const nathanKeyWif = configObj.key;
const tixonshareKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


//根据账户id获取账户信息
function getPassword(name){

    let pwd = ''
    if(name === nathanName){
		
		return tixonshareKey

    }else{
        pwd = name.length > 12 ? name : name+"_tsh2020"
    }


    const accountkeys = btsjs.Login.generateKeys(name, pwd)
    const {active} = accountkeys.pubKeys


    return new Promise((resolve, reject) => {
        btsjsws.Apis.instance().db_api().exec("get_key_references", [[active]]).then(res=>{
            const [[accountId]] = res
            if(dataType(accountId) === 'Undefined'){
                resolve(false)
            }else{
                getAccuountById(accountId).then(userInfo=>{

                    if(userInfo === null){
                        resolve(false)
                    }else{
                        if(name === userInfo[0].name){
                            resolve(accountkeys)
                        }else{
                            resolve(false)
                        }

                    }
                })
            }
        }).catch(error=>{
            resolve(false)
        })
    })
    
}




module.exports = getPassword;