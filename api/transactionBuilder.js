const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getBalance = require("../utils/getBalance");
const getuser = require("../utils/getAccuountByName");
const getPassword = require("../utils/getPassword");
const configObj = require("../config").config;


const { isEmpty,dataType } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

// const nathanName = configObj.name;
// const nathanKeyWif = configObj.key;
// const tixonshareKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


async function transactionBuilder(req, res, next) {
    // 连接到测试节点。
    const {params} = req.body
    console.log('发送交易')

    let fromName=params.from
    let toName =params.to
    let amount=params.amount


    let fromAmount = 0

    if(dataType(params) === 'Array'){
        fromName = params[0].toLowerCase()
        toName = params[1].toLowerCase()
        amount = params[2]
    }
    if(!isEmpty(fromName)){
        res.send({
            content:'转账人不能为空',
            msg:''
        })
    }else if(!isEmpty(toName)){
        res.send({
            content:'收款人不能为空',
            msg:''
        })
    }else if(!isEmpty(amount)){
        res.send({
            content:'收款金额不能为空',
            msg:''
        })
    }else{

        // 获取转账人余额
        const balance= await getBalance(fromName)
        if(dataType(balance) !== 'Null'){
            if(balance.length>0){
                fromAmount = balance[0].amount
            }else{
                fromAmount = 0
            }
        }
        console.log(fromName,toName,fromAmount,amount)


        if(await getuser(fromName) === null){
            res.send({
                content:'转账人不存在',
                msg:''
            })
        }else if(await getuser(toName) === null){
            res.send({
                content:'收款人不存在',
                msg:''
            })
        }else if(fromAmount < 2105468+Number(amount)){
            res.send({
                content:'转账人余额不足',
                msg:''
            })
        } else{

            // tsh7616 tixonshare 33000007

            const formAccount = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [fromName]);

            // const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
            const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
            let tr = new btsjs.TransactionBuilder();
            // const precision = Math.pow(10, coreAsset.get("precision"));
            const nonce = btsjs.TransactionHelper.unique_nonce_uint64();
            
            const fromAccountkeys = await getPassword(fromName)
            const toAccountkeys = await getPassword(toName)


            if(!fromAccountkeys){
                res.send({
                    content:'转账人密码错误',
                    msg:''
                })    
                return false
            }
            
            if(!toAccountkeys){
                res.send({
                    content:'收款人密码错误',
                    msg:''
                })    
                return false
            } 
            
            const transctionAccount = await btsjs.FetchChain("getAccount", toName);


            const fromPubKeys =  configObj.name === fromName ? fromAccountkeys.toPublicKey().toString() : fromAccountkeys.pubKeys.active
            const toPubKeys =  configObj.name === toName ? toAccountkeys.toPublicKey().toString() : toAccountkeys.pubKeys.active
            // memo
            const formActiveKey = configObj.name === fromName ? fromAccountkeys : fromAccountkeys.privKeys.active

            const memo_object = {
                from:fromPubKeys,
                to: toPubKeys,
                nonce: nonce,
                message: btsjs.Aes.encrypt_with_checksum(
                    formActiveKey,
                    toPubKeys,
                    nonce,
                    "Some coins for test"
                )
            }
            
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: coreAsset.get("id")
                },
                from: formAccount.id,
                to: transctionAccount.get("id"),
                amount: {
                    amount:amount || 0,
                    // amount: (BigInt(chainProperties.parameters.minimum_masternode_stake) + 100n * BigInt(precision)).toString(),
                    asset_id: coreAsset.get("id")
                },
                memo: memo_object
            });

            console.log(6)

            await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
            console.log(7)
            tr.add_signer(formActiveKey, fromPubKeys);
            console.log(8)
            const transctionResult = await tr.broadcast();
            console.log(9)

            res.send({
                content:transctionResult,
                msg:''
            })
            
            

        }


        
    }


    
    next()

}





module.exports = transactionBuilder;