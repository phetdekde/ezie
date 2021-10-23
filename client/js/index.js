const CONTRACT_ADDRESS = '0xCD21Ce98ff12AE08CE6f8c99bec11B797896A65c';

function getAbi() {
    return new Promise((res) => {
        $.getJSON('../js/Token.json', ((json) => {
            res(json.abi);
        }))
    })
}

async function getContract() {
    let abi = await getAbi();
    return new web3.eth.Contract(abi, CONTRACT_ADDRESS);
}

export { getContract };