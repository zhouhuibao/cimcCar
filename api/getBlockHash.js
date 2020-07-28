const btsjsws = require("bitsharesjs-ws");
const configObj = require("../config");
const btsjs = require("bitsharesjs");
const getuser = require("../utils/getAccuountByName");
const { isNumber,isEmpty } = require("../utils/utils");
require("util").inspect.defaultOptions.depth = null;


async function getBlockHash(req, res, next) {
    const {params} = req.body
    console.log('获取账户历史记录')

    if(!isEmpty(params)){
        response.send({
            content:'请传入账户名',
        })
        next()
    }else{
        let name=params
        if(dataType(params) === 'Array'){
            name=params.join(',')
        }
        name =name.toLowerCase()

        const testAccount = await btsjs.FetchChain("getAccount", name);
        const testHistory = await btsjs.ChainStore.fetchRecentHistory(testAccount);// btsjsws.Apis.instance().history_api().exec("get_account_history", [testAccountName]);
        console.log("测试帐户最新历史记录：");

        if (testHistory.has("history")) {
            for (const op of testHistory.get("history")) {
                // console.log("block " + op.get("block_num") + " tx " + op.get("trx_in_block") + " op " + op.get("op_in_trx"));

                // Get transaction in a block.
                const tx = await btsjsws.Apis.instance().db_api().exec("get_transaction", [op.get("block_num"), op.get("trx_in_block")]);
                // console.log(tx);
            }
        }

        res.send({
            content:testHistory
        })
        next()
    }


}

module.exports = getBlockHash;