var { Apis, ChainConfig } = require("bitsharesjs-ws");
// modify chain_id
//console.log(ChainConfig.networks.BitShares.chain_id);
ChainConfig.networks.BitShares.chain_id = "59af7726129cb6bb72bb607724882469a47912acb08319a1e65ecc88b0d6b974";
var { PrivateKey,TransactionBuilder } = require('bitsharesjs');
var util = require('util');

Apis.instance("ws://0.0.0.0:40201", true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
    Apis.db.set_subscribe_callback(updateListener, true)
    create_account(process.argv[2]);
});
function gen_keypair(account_name) {
    let private_key = PrivateKey.fromSeed(account_name);
    return ({ privKey: private_key.toWif(), pubKey: private_key.toPublicKey().toString() })
}
async function create_account(account_name) {
    let registrar = '1.2.9';    // change this
    let referrer = '1.2.9';     // change this
    let kv = gen_keypair(account_name);
    // for registrar(admin)
    let signing_key = PrivateKey.fromWif("5KNP4D9K3FL1gBtRtanhfgLZTpz1wcJVsLEQXonRMeAwzMDL2se");
    console.log('key pair:', kv);
    let create_account_op = {
        fee: {
            amount: 0,
            asset_id: 0
        },
        registrar: registrar,
        referrer: referrer,
        referrer_percent: 0,
        name: account_name,
        owner: {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[kv.pubKey, 1]],
            address_auths: []
        },
        active: {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[kv.pubKey, 1]],
            address_auths: []
        },
        options: {
            memo_key: kv.pubKey,
            voting_account: "1.2.5",    // proxy-to-self
            num_witness: 0,
            num_committee: 0,
            votes: []
        }
    }
    try {
        let tr = new TransactionBuilder();
        tr.add_type_operation("account_create", create_account_op);
        await tr.set_required_fees();
        tr.add_signer(signing_key);
        console.log("serialized transaction:", util.inspect(tr.serialize(), true, null, true));
        let res = await tr.broadcast();
        console.log('broadcast done', JSON.stringify(res));
        return res;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
function updateListener(object) {
    console.log("set_subscribe_callback:\n", object);
}