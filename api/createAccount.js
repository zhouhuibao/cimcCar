const btsjsws = require("bitsharesjs-ws");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const { isNumber,isEmpty,dataType } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;

const nathanName = "tixonshare";
const nathanKeyWif = "5K4Cij8gxaafBUHGn9cRNK5To541Vb5hta4vcqBmES8A2EjgQhs";
const nathanKey = btsjs.PrivateKey.fromWif(nathanKeyWif);

async function createAccount(req, res, next) {
    const {params} = req.body
    
    let name =params
    // let name =params.toLowerCase()

    console.log('创建账户')

    let reg = /^[a-zA-Z]\w{3,31}$/


    if(!reg.test(name)){
        res.send({
            content:'账户名不能低于4位,只能以字母开头'
        })
    }else{
        const isAccount = await getuser(name)  // 先查看账户是否已经注册

        if(isAccount === null){
            
            // 连接到测试节点。
            await btsjs.ChainStore.init(false);
            const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

            let tr = new btsjs.TransactionBuilder();

            const password = name.length>12 ? name : name+"_tsh2020"
            const testKeys = btsjs.Login.generateKeys(name, password);

            tr.add_type_operation("account_create", {
                fee: {
                    amount: 0,
                    asset_id: 0
                },
                registrar: nathan.id,
                referrer: nathan.id,
                referrer_percent: 50,
                name: name,
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