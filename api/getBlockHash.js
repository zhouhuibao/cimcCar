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
    chain_id: "3744350bd818ffe041784c0f9903bd97870f33b8d9cbc8dd7f3fa0c92947ea7f"
}
 
// 默认的key
const nathanName = "nathan";
const nathanKeyWif = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
const nathanKey = btsjs.PrivateKey.fromWif(nathanKeyWif);



async function getBlockHash(req, res, next) {
    const {params} = req.body


    // 连接到测试节点。
    await btsjsws.Apis.instance(configObj.ip, true).init_promise;
    await btsjs.ChainStore.init(false);

    const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [nathanName]);

    const testAccount = await btsjs.FetchChain("getAccount", params);
    const testHistory = await btsjs.ChainStore.fetchRecentHistory(testAccount);// btsjsws.Apis.instance().history_api().exec("get_account_history", [testAccountName]);
    console.log("测试帐户最新历史记录：");
    // console.log(testHistory);

    if (testHistory.has("history")) {
        for (const op of testHistory.get("history")) {
            console.log("block " + op.get("block_num") + " tx " + op.get("trx_in_block") + " op " + op.get("op_in_trx"));

            // Get transaction in a block.
            const tx = await btsjsws.Apis.instance().db_api().exec("get_transaction", [op.get("block_num"), op.get("trx_in_block")]);
            console.log("测试用户 tx:");
            console.log(tx);
        }
    }

    res.send({
        content:testHistory
    })
        

        
    next()

}

module.exports = getBlockHash;