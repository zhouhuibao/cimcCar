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

    console.log(req.body)
    console.log(req.body.params)
    const {params} = req.body

    // 使用DB API获取Nathan帐户。
    const nathan = await btsjsws.Apis.instance().db_api().exec("get_account_by_name", [name]);

    


    if(nathan === null){
        res.send(
            res.send({
                content:null,
                msg:'用户不存在'
            })
        )
    }else{
        res.send({
            content:nathan,
            msg:''
        })
    }

    next()
}





module.exports = run;