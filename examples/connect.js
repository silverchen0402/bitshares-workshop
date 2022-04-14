var { Apis } = require('bitsharesjs-ws');

let chain_url = "ws://0.0.0.0:40201"

Apis.instance(chain_url, true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
});
