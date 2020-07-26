const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const getPassword = require("../utils/getPassword");


const getBalance = require("../utils/getBalance");
const { isEmpty,dataType } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

const nathanName = "tixonshare";
const nathanKeyWif = "5K4Cij8gxaafBUHGn9cRNK5To541Vb5hta4vcqBmES8A2EjgQhs";
const tixonshareKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


async function transactionBuilder(req, res, next) {
    // 连接到测试节点。
    const {params} = req.body
    console.log('发送交易')

    // let {to,amount}=params

    let from=params.from
    let to=params.to
    let amount=params.amount

    if(dataType(params) === 'Array'){
        from = params[0].toLowerCase()
        to = params[1].toLowerCase()
        amount = params[2]
    }
    if(!isEmpty(from)){
        res.send({
            content:'转账人不能为空',
            msg:''
        })
    }else if(!isEmpty(to)){
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

        // const account = await getuser(to)
        // const account = await getuser(to)
        if(await getuser(from) === null){
            res.send({
                content:'转账人不存在',
                msg:''
            })
        }else if(await getuser(to) === null){
            res.send({
                content:'收款人不存在',
                msg:''
            })
        }else{
            await btsjs.ChainStore.init(false);

            const formAccount = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [from]);

            // const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
            const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
            let tr = new btsjs.TransactionBuilder();
            // const precision = Math.pow(10, coreAsset.get("precision"));
            const nonce = btsjs.TransactionHelper.unique_nonce_uint64();
            
            const fromAccountkeys = await getPassword(from)
            const toAccountkeys = await getPassword(to)

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
			
			
            
            const transctionAccount = await btsjs.FetchChain("getAccount", to);
            
			const fromPublicKey =  from === 'tixonshare' ? fromAccountkeys.toPublicKey().toString() : fromAccountkeys.pubKeys.active
			const toPublicKey =  to === 'tixonshare' ? fromAccountkeys.toPublicKey().toString() : toAccountkeys.pubKeys.memo
			console.log(1)
			console.log(2)
            const memo_object = {
                from:fromPublicKey,
                to:toPublicKey,
                nonce: nonce,
                message: btsjs.Aes.encrypt_with_checksum(
                    fromPublicKey,
                    toPublicKey,
                    nonce,
                    "Some coins for test"
                )
            }
            
            console.log(3)

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

            await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
			
            tr.add_signer(fromAccountkeys, fromPublicKey);
            const transctionResult = await tr.broadcast();

            res.send({
                content:transctionResult,
                msg:''
            })
            
            

        }


        
    }


    
    next()

}





module.exports = transactionBuilder;