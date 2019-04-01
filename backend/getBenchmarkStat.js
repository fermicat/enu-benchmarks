const endpoint = "http://api.hkeos.com:80";
const Eos = require("eosjs");
const eos = Eos({httpEndpoint: endpoint});
const account = "eosmechanics";

let transactions = [];

async function handleActions(data) {
  for (let i = 0; i < data.actions.length; i++) {
    let action = data.actions[i];
    let transaction = {
      id: action.action_trace.trx_id,
      block: action.block_num
    };
    await eos.getBlock(action.block_num).then(data => {
      for (let t = 0; t < data.transactions.length; t++) {
        if (data.transactions[t].trx.id == transaction.id) {
          let trx = data.transactions[t];
          transaction.timestamp = data.timestamp;
          transaction.block_cpu_usage_us = trx.cpu_usage_us;
          transaction.producer = data.producer;
        }
      }
    });
    await eos.getTransaction(transaction.id).then(data => {
      transaction.trx_cpu_usage_us = data.trx.receipt.cpu_usage_us;
    });
    // uncomment here and change producer name to filter
    //if (transaction.producer == 'caleosblocks')
    transactions.push(transaction);
  }
}

async function doIt() {
  // here you should be smarter about the getActions arguments, likely you want to query in batches
  // or loop/sleep and query from the previous loops index
  await eos.getActions(account, -1, -100).then(handleActions);
  console.log(transactions[i].timestamp + ": " + transactions[i].trx_cpu_usage_us);
  //console.log(JSON.stringify(transactions, null, 4));
}

doIt();