const btsjsws = require("bitsharesjs-ws");
const configObj = require("../config");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const getBalance = require("../utils/getBalance");
const { isEmpty } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

// 初始化链配置。
btsjsws.ChainConfig.networks["TixonshareTestnet"] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id: "3744350bd818ffe041784c0f9903bd97870f33b8d9cbc8dd7f3fa0c92947ea7f"
}
 
// 默认的key
const nathanName = "nathan";
const nathanKeyWif = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
const nathanKey = btsjs.PrivateKey.fromWif(nathanKeyWif);



async function transactionBuilder(req, res, next) {
    // 连接到测试节点。
    const {params} = req.body
    const {to,amount}=params

    if(!isEmpty(to)){
        res.send({
            content:'收款人不能为空',
            msg:''
        })
    }else if(!isEmpty(to)){
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
            await btsjsws.Apis.instance(configObj.ip, true).init_promise;
            await btsjs.ChainStore.init(false);

            const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

            console.log(req.body)
            const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
            const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
            let tr = new btsjs.TransactionBuilder();


            const nonce = btsjs.TransactionHelper.unique_nonce_uint64();

            

            const toAccountkeys = btsjs.Login.generateKeys(to, to)
            const transctionAccount = await btsjs.FetchChain("getAccount", to);

            const memo_object = {
                from: nathanKey.toPublicKey().toString(),
                to: toAccountkeys.pubKeys.memo,
                nonce: nonce,
                message: btsjs.Aes.encrypt_with_checksum(
                    nathanKey,
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
            tr.add_signer(nathanKey, nathanKey.toPublicKey().toString());
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