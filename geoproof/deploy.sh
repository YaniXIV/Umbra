APPNAME="geoproof"
PRIVATEKEY="aleo1m9yv8h0rcrq3gszuxd0rann95ddess3nkwz8trfgpqjj6ugzwvxq3ljusz"


snarkos developer deploy "${APPNAME}.aleo" --private-key "${PRIVATEKEY}" --query "https://vm-aleo.org/api" --path "./build" --broadcast "https://vm.aleo.org/api/testnet3/transaction/broadcast" --priority-fee 1000000

