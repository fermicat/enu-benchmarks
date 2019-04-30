#!/bin/sh
#
# Benchmark actions script.
#

API_URL="http://127.0.0.1:8888"
WALLET_URL="http://127.0.0.1:8900/"
WALLET_NAME="yourwallet"
WALLET_PASS="password to yourwallet wallet with benchmark permission key"
PATH="$PATH:/usr/local/bin:/usr/local/enumivo/bin/"

date
enucli -u "$API_URL" --wallet-url "$WALLET_URL" wallet unlock -n "$WALLET_NAME" --password "$WALLET_PASS"
enucli -u "$API_URL" --wallet-url "$WALLET_URL" push action enubifreelab cpu '[]' -p enubifreelab@benchmark -f
#enucli -u "$API_URL" --wallet-url "$WALLET_URL" push action enubifreelab ram '' -p enubifreelab@benchmark -f
#enucli -u "$API_URL" --wallet-url "$WALLET_URL" push action enubifreelab net '' -p enubifreelab@benchmark -f
enucli -u "$API_URL" --wallet-url "$WALLET_URL" wallet stop
