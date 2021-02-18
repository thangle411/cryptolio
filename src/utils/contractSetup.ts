import Web3 from 'web3';

export function contractSetup(address: string) {
    const infura = process.env.VUE_APP_INFURA || '';
    const web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(infura));
    const contract = new web3.eth.Contract([
        {
            "constant":true,
            "inputs":[{"name":"_owner","type":"address"}],
            "name":"balanceOf",
            "outputs":[{"name":"balance","type":"uint256"}],
            "type":"function"
        },
        {
            "constant":true,
            "inputs":[],
            "name":"decimals",
            "outputs":[{"name":"","type":"uint8"}],
            "type":"function"
        }
    ],address);

    return contract;
}
