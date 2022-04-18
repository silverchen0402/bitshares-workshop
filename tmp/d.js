var { Apis, ChainConfig } = require("bitsharesjs-ws");
// modify chain_id
//console.log(ChainConfig.networks.BitShares.chain_id);
ChainConfig.networks.BitShares.chain_id = "59af7726129cb6bb72bb607724882469a47912acb08319a1e65ecc88b0d6b974";

Apis.instance("ws://0.0.0.0:40201", true).init_promise
    .then((res) => {
        console.log("connected to:", res[0].network);
        Apis.instance().db_api()
            .exec("get_account_balances", ["admin", []])
            .then((e) => {
                console.log(e)
            })
    });

/* output sample
  connected to: {
    core_asset: 'BTS',
    address_prefix: 'BTS',
    chain_id: '59af7726129cb6bb72bb607724882469a47912acb08319a1e65ecc88b0d6b974'
  }
  [ { amount: '599998962161543', asset_id: '1.3.0' } ]
*/  