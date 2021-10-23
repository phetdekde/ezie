Moralis.initialize("o113qwSsl3hbQrRwTQeAhG1Bydxf3jxq0xUONhzX"); // Application id from moralis.io
Moralis.serverURL = "https://qexoyo0cyt3t.grandmoralis.com:2053/server"; //Server url from moralis.io
import { getContract } from './index.js'

init();

async function init() {
    try {
        let user = Moralis.User.current();
        if(!user) {
            $('#login_button').click(async () => {
                user = await Moralis.Web3.authenticate();
            })
        }
        renderGame();
    } catch (error) {
        console.log(error);
    }
}

async function renderGame() {
    $('#login_button').hide();
    $('#market_row').html('');

    window.web3 = await Moralis.Web3.enable();
    // let abi = await getAbi();
    // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let contract = await getContract();
    let array = await contract.methods.getAllSellingTokens().call({from: ethereum.selectedAddress});
    
    array.forEach(async (plantId) => {
        let details = await contract.methods.getTokenDetails(plantId).call({from: ethereum.selectedAddress});
        let price = await contract.methods.getPrice(plantId).call({from: ethereum.selectedAddress});
        let ethPrice = web3.utils.fromWei(price, 'ether');
        renderPlant(plantId, details, ethPrice, contract);
    });

    $('#game').show();
}

async function renderPlant(id, data, price, contract) {
    let acquired = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
    let imgSrc;
    if(data.plantType === 'Sunflower') {
        imgSrc = 'https://static.wikia.nocookie.net/plantsvszombies/images/e/e6/1769830-plant_sunflower_smiling_thumb.png';
    } else if (data.plantType === 'Peashooter') {
        imgSrc = 'https://static.wikia.nocookie.net/plantsvszombies/images/0/09/1769829-plant_peashooter_thumb.png';
    } else {
        imgSrc = 'https://static.wikia.nocookie.net/plantsvszombies/images/8/86/Melonpult2009HD.png';
    }

    let htmlString = ` 
    <div class="card mx-4" id="plant_${id}">
        <img class="card-img-top plant_img" src=${imgSrc}>
        <div class="card-body">
            <div>Id: <span class="plant_id">#${id}</span></div>
            <div>Health: <span class="plant_health">${data.health}</span></div>
            <div>Damage: <span class="plant_damage">${data.damage}</span></div>
            <div>Type: <span class="plant_type">${data.plantType}</span></div>
            <div>Price: <span class="plant_price">${price}</span></div>
            ${ !acquired.includes(id) ? `<button id="buying_${id}">BUY</button>` : ''}
        </div>
    </div>`;

    let element = $.parseHTML(htmlString);
    $('#market_row').append(element);

    $(`#buying_${id}`).click(async () => {
        // let abi = await getAbi();
        // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

        let contract = await getContract();
        await contract.methods.buy(id).send({from: ethereum.selectedAddress, value: web3.utils.toWei(price, 'ether')}).on('receipt', (receipt) => {
            console.log(receipt);
            renderGame();
        })
    })
}

$('#selling').click(async () => {
    let id = document.querySelector('#petIdInput');
    let price = document.querySelector('#setPriceInput');
    // let abi = await getAbi();
    // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

    let contract = await getContract();
    await contract.methods.allowBuy(id.value, web3.utils.toWei(price.value, 'ether')).send({from: ethereum.selectedAddress}).on('receipt', (receipt) => {
        console.log(receipt);
        renderGame();
    })
})