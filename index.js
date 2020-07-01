// 导入BitShares插件


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

// 主要功能
async function run() {
    // 连接到测试节点。
    await btsjsws.Apis.instance("ws://34.227.217.98:33000", true).init_promise;
    await btsjs.ChainStore.init(false);
    btsjs.ChainStore.subscribe(onChainStoreUpdate);

    // 使用DB API获取Nathan帐户。
    const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);
    console.log("Nathan from DB API:");
    // console.log(nathan);

    // 使用btsjs获取Nathan帐户。
    {
        const nathan = await btsjs.FetchChain("getAccount", nathanName);
        console.log("使用btsjs获取Nathan帐户。");
        // console.log(nathan);
    }

    // Get transaction from a block.
    {
        // 获取最新不可逆块中的第一个事务（如果存在或有错误）。
        const dgpo = await btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []);
        console.log(dgpo)
        try {
            const tx = await btsjsws.Apis.instance().db_api().exec("get_transaction", [dgpo.last_irreversible_block_num, 0]);
            console.log("不可逆发送：");
            console.log(tx);
        } catch (e) {
            console.log("block " + dgpo.last_irreversible_block_num + " 不包含事务");
            console.log(e);
        }
    }

    return false

    // // 获取区块高度
    // {
    //     const dgpo = await btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []);
    //     console.log("动态全局 props:");
    //     console.log(dgpo);
    //     console.log("区块高度" + dgpo.head_block_number);
    // }




    // // 获取链属性。
    const chainProperties = await btsjsws.Apis.instance().db_api().exec("get_global_properties", []);
    // console.log("获取链属性。");
    // console.log(chainProperties);
    // console.log("主节点桩: " + chainProperties.parameters.minimum_masternode_stake);

    const coreAsset = await btsjs.FetchChain("getAsset", "TSH");
    // console.log("asset:");
    // console.log(coreAsset);
    const precision = Math.pow(10, coreAsset.get("precision"));
    // console.log("precision: " + precision);
    
    // 创建新帐户。
    // Generate temporary name.   生成临时名称。
    // const testAccountName = "test" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    const testAccountName = "tests11234567897877887";
    // console.log("创建帐户 " + testAccountName);
    // // Generate keys, use account name as password in this example.
    const testKeys = btsjs.Login.generateKeys(testAccountName, testAccountName);
    // console.log("test keys:");
    // console.log(testKeys.pubKeys);

    // Create registration transaction.

    {
        let tr = new btsjs.TransactionBuilder();
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
        const broadcastResult = await tr.broadcast();
        console.log("registration broadcast result: 注册广播结果");
        // console.log(broadcastResult);
    }

    const testAccount = await btsjs.FetchChain("getAccount", testAccountName);
    // console.log("test account:");
    // console.log(testAccount);

    // 转账
    {
        const nonce = btsjs.TransactionHelper.unique_nonce_uint64();
        console.log("nonce: " + nonce);

        const memo_object = {
            from: nathanKey.toPublicKey().toString(),
            to: testKeys.pubKeys.memo,
            nonce: nonce,
            message: btsjs.Aes.encrypt_with_checksum(
                nathanKey,
                testKeys.pubKeys.memo,
                nonce,
                "Some coins for test"
            )
        }

        let tr = new btsjs.TransactionBuilder();
        tr.add_type_operation("transfer", {
            fee: {
                amount: 0,
                asset_id: coreAsset.get("id")
            },
            from: nathan.id,
            to: testAccount.get("id"),
            amount: {
                amount:101,
                // amount: (BigInt(chainProperties.parameters.minimum_masternode_stake) + 100n * BigInt(precision)).toString(),
                asset_id: coreAsset.get("id")
            },
            memo: memo_object
        });

        await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
        tr.add_signer(nathanKey, nathanKey.toPublicKey().toString());
        const broadcastResult = await tr.broadcast();
        console.log("transfer broadcast result:  转账的结果");
        console.log(broadcastResult);
    }

    //使用DB API获取测试帐户余额
    // {
    //     const balances = await btsjsws.Apis.instance().db_api().exec("get_account_balances", [testAccountName, [coreAsset.get("id")]]);
    //     console.log("使用DB API获取测试帐户余额");
    //     console.log(balances);
    // }

    {
        const num = await btsjsws.Apis.instance().db_api().exec("get_objects", [testAccountName, [coreAsset.get("id")]]);
        console.log("区块高度");
        console.log(num);
    }

    // Apis.instance().db_api().exec('get_objects', [['1.2.17']]).then(r => {  // 2.1.0
    //     console.log(r)
    //     console.log(r[0].head_block_number,'区块高度')
    //   })



    // {
    //     const balances = await btsjsws.Apis.instance().db_api().exec("get_account_balances", ['1.2.17', []]);
    //     console.log("获取nathan账户的余额");
    //     console.log(balances);
    // }



    // // 注册主节点
    // // TODO:当btsjs支持主节点操作时启用。
    // if (false)
    // {
    //     let tr = new btsjs.TransactionBuilder();
    //     tr.add_type_operation("masternode_create", {
    //         fee: {
    //             amount: 0,
    //             asset_id: coreAsset.get("id")
    //         },
    //         owner: testAccount.get("id"),
    //         stake: {
    //             amount: chainProperties.parameters.minimum_masternode_stake,
    //             asset_id: coreAsset.get("id")
    //         }
    //     });

    //     await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
    //     tr.add_signer(testKeys.privKeys.active, testKeys.pubKeys.active);
    //     const broadcastResult = await tr.broadcast();
    //     console.log("MN注册广播结果：");
    //     console.log(broadcastResult);
    // }

    // const testMn = await btsjsws.Apis.instance().db_api().exec("get_masternodes_by_owner", [[testAccount.get("id")]]);
    // console.log("test masternode:");
    // console.log(testMn);

    // // Get masternode interest.
    // while (true) {
    //     if (testMn.length <= 0) {
    //         break;
    //     }

    //     const masternode = testMn[0];
    //     if (!masternode) {
    //         break;
    //     }

    //     if (!masternode.balance) {
    //         break;
    //     }

    //     const balance = await btsjs.FetchChain("getObject", masternode.balance);
    //     console.log("mn balance:");
    //     console.log(balance);

    //     let tr = new btsjs.TransactionBuilder();

    //     tr.add_type_operation("vesting_balance_withdraw", {
    //         fee: {
    //             amount: 0,
    //             asset_id: coreAsset.get("id")
    //         },
    //         owner: testAccount.get("id"),
    //         vesting_balance: masternode.balance,
    //         amount: {
    //             amount: balance.balance.amount,
    //             asset_id: balance.balance.asset_id
    //         }
    //     });

    //     await Promise.all([tr.set_required_fees(), tr.update_head_block()]);
    //     tr.add_signer(testKeys.privKeys.active, testKeys.pubKeys.active);
    //     const broadcastResult = await tr.broadcast();
    //     console.log("余额索赔广播结果：");
    //     console.log(broadcastResult);

    //     break;
    // }

    // 获取测试帐户历史记录。.
    // {
    //     const testHistory = await btsjs.ChainStore.fetchRecentHistory(testAccount);// btsjsws.Apis.instance().history_api().exec("get_account_history", [testAccountName]);
    //     console.log("测试帐户最新历史记录：");
    //     console.log(testHistory);

    //     if (testHistory.has("history")) {
    //         for (const op of testHistory.get("history")) {
    //             console.log("block " + op.get("block_num") + " tx " + op.get("trx_in_block") + " op " + op.get("op_in_trx"));

    //             // Get transaction in a block.
    //             const tx = await btsjsws.Apis.instance().db_api().exec("get_transaction", [op.get("block_num"), op.get("trx_in_block")]);
    //             console.log("test account tx:");
    //             console.log(tx);
    //         }
    //     }
    // }

    

    return false


    // Get transaction from a block.
    {
        // 获取最新不可逆块中的第一个事务（如果存在或有错误）。
        const dgpo = await btsjsws.Apis.instance().db_api().exec("get_dynamic_global_properties", []);
        try {
            const tx = await btsjsws.Apis.instance().db_api().exec("get_transaction", [dgpo.last_irreversible_block_num, 0]);
            console.log("不可逆发送：");
            console.log(tx);
        } catch (e) {
            console.log("block " + dgpo.last_irreversible_block_num + " 不包含事务");
            console.log(e);
        }
    }

    // 获取主节点计数。
    {
        const mnCount = await btsjsws.Apis.instance().db_api().exec("get_masternode_count", []);
        console.log("主节点总数量: " + mnCount);
    }
    // 按ID获取主节点。对于与注册的主节点不对应的ID，返回空值。
    {
        const masternodes = await btsjsws.Apis.instance().db_api().exec("get_masternodes", [["1.17.0", "1.17.987654321"]]);
        console.log("主节点实例");
        console.log(masternodes);
    }
    // 按所有者获取主节点。如果帐户没有主节点，则返回null。
    {
        const masternodes = await btsjsws.Apis.instance().db_api().exec("get_masternodes_by_owner", [[testAccount.get("id"), nathan.id, "1.2.0"]]);
        console.log("按所有者列出的主节点");
        console.log(masternodes);
    }
    // 获取拥有指定主节点的帐户。如果指定的mn ID不存在，则返回null。
    {
        const accounts = await btsjsws.Apis.instance().db_api().exec("get_masternode_owner_ids", [["1.17.0", "1.17.987654321"]]);
        console.log("主节点所有者：");
        console.log(accounts);
    }
}

async function onChainStoreUpdate(object) {
    console.log("onChainStoreUpdate:");
    console.log(object);
}

run().
    then(() => {
        process.exit(0)
    }).
    catch(err => {
        console.log(err);
        process.exit(-1)
    })
