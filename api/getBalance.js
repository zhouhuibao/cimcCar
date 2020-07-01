const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
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



async function run(req, res, next) {
    // 连接到测试节点。
    await btsjsws.Apis.instance("ws://34.227.217.98:33000", true).init_promise;
    await btsjs.ChainStore.init(false);

    const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

    console.log(req.body)
    const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
    const {params,method} = req.body
    const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
    let tr = new btsjs.TransactionBuilder();

    let response={}

    let content = null;

    switch (method) {
        case 'getbalance':  // 获取账户余额
            console.log('余额')
            btsjsws.Apis.instance().db_api().exec("get_account_balances", [params, [coreAsset.get("id")]]).then(balance=>{
                res.send({
                    content:balance,
                    msg:''
                })
                next()

            }).catch(error=>{
                res.send({
                    content:null,
                    msg:''
                })
                next()
            });
            break;
        case 'getuserInfo':
            const getuserInfoAccount = await btsjs.FetchChain("getAccount", params);
            res.send({
                content:getuserInfoAccount,
                msg:''
            })
            next()
            break;
        case 'TransactionBuilder': // 转账
            const nonce = btsjs.TransactionHelper.unique_nonce_uint64();
            console.log("nonce: " + nonce);

            
            const {to,amount}=params

            const toAccountkeys = btsjs.Login.generateKeys(to, to)
            const transctionAccount = await btsjs.FetchChain("getAccount", to);
            console.log(transctionAccount)

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
            console.log("transfer broadcast result:  转账的结果");
            console.log(transctionResult);

            res.send({
                content:transctionResult,
                msg:''
            })
            next()


            break;
        
        case 'headBlockNumber': // 获取区块高度
        
            btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []).then(headBlockNumber=>{
                res.send({
                    content:headBlockNumber,
                    msg:''
                })
                next()

            }).catch(error=>{
                res.send({
                    content:null,
                    msg:''
                })
                next()
            });
            break;
        
        case 'createAccount': // 创建用户
            const testAccountName = params;
            const testKeys = btsjs.Login.generateKeys(testAccountName, testAccountName);
            tr.add_type_operation("account_create", {
                fee: {
                    amount: 0,
                    asset_id: 0
                },
                registrar: nathan.id,
                referrer: nathan.id,
                referrer_percent: 50,
                name: testAccountName,
                owner: {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [[testKeys.pubKeys.owner, 1]],
                    address_auths: []
                },
                active: {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [[testKeys.pubKeys.active, 1]],
                    address_auths: []
                },
                options: {
                    memo_key: testKeys.pubKeys.memo,
                    voting_account: "1.2.5",
                    num_witness: 0,
                    num_committee: 0,
                    votes: []
                }
            });
            await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
            tr.add_signer(nathanKey, nathanKey.toPublicKey().toString());
            let accountResult = await tr.broadcast();
            console.log("registration broadcast result: 注册广播结果");
            console.log(accountResult);

            res.send({
                content:accountResult,
                msg:''
            })
            next()

            break;
            
        default:
            break;
    }


    // res.send({
    //     content:content,
    //     msg:''
    // })


}





module.exports = run;