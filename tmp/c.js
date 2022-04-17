var { Apis, ChainConfig } = require("bitsharesjs-ws");
// modify chain_id
//console.log(ChainConfig.networks.BitShares.chain_id);
ChainConfig.networks.BitShares.chain_id = "e9d1707869ef23f1fe64545543939b5b053d6b9c16a8b02ad2004bc4c735e6e6";
var { PrivateKey, TransactionBuilder, FetchChain } = require('bitsharesjs');
var util = require('util');

Apis.instance("ws://0.0.0.0:40201", true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
    Apis.db.set_subscribe_callback(updateListener, true)
    demo_transfer(process.argv[2], process.argv[3]);
});

async function demo_transfer(_to, _amount) {
    let _from = "1.2.9";
    let signing_key = PrivateKey.fromWif("5KNP4D9K3FL1gBtRtanhfgLZTpz1wcJVsLEQXonRMeAwzMDL2se");
    let tr = new TransactionBuilder()
    let _to_obj = await FetchChain("getAccount", _to);
    //
    tr.add_type_operation("transfer", {
        fee: {
            amount: 0,
            asset_id:"1.3.0"
        },
        from: _from,
        to: _to_obj.get("id"),
        amount: { amount: _amount, asset_id: "1.3.0" }
        
    })

    await tr.set_required_fees();
    tr.add_signer(signing_key);
    console.log("serialized transaction:", tr.serialize());
    let res = await tr.broadcast();
    console.log('broadcast done', JSON.stringify(res));
    return res;
}

function updateListener(object) {
    console.log("set_subscribe_callback:\n", object);
}