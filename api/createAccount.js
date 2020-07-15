const btsjsws = require("bitsharesjs-ws");
const configObj = require("../config");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const { isNumber } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

// 初始化链配置。
btsjsws.ChainConfig.networks["TixonshareTestnet"] = {
    core_asset: "TSH",
    address_prefix: "TSH",
    chain_id: "ed65e883f34d62fd9a036a37bf63ebdbabb20a72e2a6ee6ff1a22557a5c0e25c"
}

// ed65e883f34d62fd9a036a37bf63ebdbabb20a72e2a6ee6ff1a22557a5c0e25c
// 默认的key

const nathanName = "tixonshare";
const nathanKeyWif = "5K4Cij8gxaafBUHGn9cRNK5To541Vb5hta4vcqBmES8A2EjgQhs";
const nathanKey = btsjs.PrivateKey.fromWif(nathanKeyWif);


async function createAccount(req, res, next) {
    const {params} = req.body


    if(params.length < 12){
        res.send({
            content:'账户不能低于12位'
        })
    }else if(isNumber(params)){
        res.send({
            content:'账户不能为纯数字'
        })
    }else{
        const isAccount = await getuser(params)  // 先查看账户是否已经注册

        if(isAccount === null){
            
            // 连接到测试节点。
            await btsjsws.Apis.instance(configObj.ip, true).init_promise;
            await btsjs.ChainStore.init(false);

            const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

            let tr = new btsjs.TransactionBuilder();

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

            const keysAuths=accountResult[0].trx.operations[0][1]
            const accountKey={
                owner_key:keysAuths.owner.key_auths[0][0],
                active_key:keysAuths.owner.key_auths[0][0],
                memo_key:keysAuths.options.memo_key
            }

            res.send({
                content:accountKey
            })
        }else{
            res.send({
                content:'账户已存在'
            })
        }

        
    }
    next()

}

module.exports = createAccount;