const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const getBalance = require("../utils/getBalance");
const { isEmpty,dataType,getPassword } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

const nathanName = "tixonshare";
const nathanKeyWif = "5K4Cij8gxaafBUHGn9cRNK5To541Vb5hta4vcqBmES8A2EjgQhs";
const tixonshareKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


async function transactionBuilder(req, res, next) {
    // 连接到测试节点。
    const {params} = req.body
    console.log('发送交易')

    // let {to,amount}=params

    let to=params.to
    let amount=params.amount

    if(dataType(params) === 'Array'){
        to = params[0].toLowerCase()
        amount = params[1]
    }

    if(!isEmpty(to)){
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

        const account = await getuser(to)
        if(account === null){
            res.send({
                content:'收款人不存在',
                msg:''
            })
        }else{
            await btsjs.ChainStore.init(false);

            const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

            // const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
            const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
            let tr = new btsjs.TransactionBuilder();
            // const precision = Math.pow(10, coreAsset.get("precision"));
            const nonce = btsjs.TransactionHelper.unique_nonce_uint64();

            const toAccountkeys = btsjs.Login.generateKeys(to, 'ronintest_tsh2020')
            // const toAccountkeys = btsjs.Login.generateKeys(to, 'ronintest_tsh2020'+ getPassword(to))
            
            const transctionAccount = await btsjs.FetchChain("getAccount", to);
            
            const memo_object = {
                from: tixonshareKey.toPublicKey().toString(),
                to: toAccountkeys.pubKeys.memo,
                nonce: nonce,
                message: btsjs.Aes.encrypt_with_checksum(
                    tixonshareKey,
                    toAccountkeys.pubKeys.memo,
                    nonce,
                    "Some coins for test"
                )
            }

            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: coreAsset.get("id")
                },
                from: nathan.id,
                to: transctionAccount.get("id"),
                amount: {
                    amount:amount || 0,
                    // amount: (BigInt(chainProperties.parameters.minimum_masternode_stake) + 100n * BigInt(precision)).toString(),
                    asset_id: coreAsset.get("id")
                },
                memo: memo_object
            });

            await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
            tr.add_signer(tixonshareKey, tixonshareKey.toPublicKey().toString());
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