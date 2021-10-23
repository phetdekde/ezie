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
    $('#plant_row').html('');

    window.web3 = await Moralis.Web3.enable();
    let contract = await getContract();
    let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});

    array.forEach(async (plantId) => {
        let details = await contract.methods.getTokenDetails(plantId).call({from: ethereum.selectedAddress});
        renderPlant(plantId, details);
    });

    $('#game').show();
}

$('#mint_button').click(async () => {
    let contract = await getContract();
    let dateInAWeek = new Date();
    dateInAWeek.setDate(dateInAWeek.getDate() + 7);
    const deadline = Math.floor(dateInAWeek.getTime() / 1000);

    await contract.methods.mint(deadline).send({from: ethereum.selectedAddress}).on('receipt', (receipt) => {
        console.log(receipt);
        renderGame();
    });
});

function renderPlant(id, data) {

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
            <div>Type: <span class="plant_type">${data.plantType }</span></div>
        </div>
    </div>`;

    let element = $.parseHTML(htmlString);
    $('#plant_row').append(element);
}