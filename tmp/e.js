var { Apis, ChainConfig } = require("bitsharesjs-ws");
var util = require('util');
// modify chain_id
//console.log(ChainConfig.networks.BitShares.chain_id);
ChainConfig.networks.BitShares.chain_id = "59af7726129cb6bb72bb607724882469a47912acb08319a1e65ecc88b0d6b974";

Apis.instance("ws://0.0.0.0:40201", true).init_promise
    .then((res) => {
        console.log("connected to:", res[0].network);
        Apis.history
            .get_account_history("demo-user-01", "1.11.0", 100, "1.11.0")
            .then((e) => {
                console.log(JSON.stringify(e));
            })
    });
