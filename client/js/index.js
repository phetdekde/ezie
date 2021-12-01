Moralis.initialize("o113qwSsl3hbQrRwTQeAhG1Bydxf3jxq0xUONhzX"); // Application id from moralis.io
Moralis.serverURL = "https://qexoyo0cyt3t.grandmoralis.com:2053/server"; //Server url from moralis.io
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

async function logout() {
    await Moralis.User.logOut();
    window.location.reload();
}

var initialAddress, newAddress;
function interval() {
    initialAddress = ethereum.selectedAddress;
    newAddress = ethereum.selectedAddress;
    setInterval(() => {
        newAddress = ethereum.selectedAddress;
        if(initialAddress !== newAddress) {
            logout();
        }
    }, 1000);
}

export { getContract, interval };