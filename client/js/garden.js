Moralis.initialize("o113qwSsl3hbQrRwTQeAhG1Bydxf3jxq0xUONhzX"); // Application id from moralis.io
Moralis.serverURL = "https://qexoyo0cyt3t.grandmoralis.com:2053/server"; //Server url from moralis.io
import { getContract, interval } from './index.js'

init();

async function init() {
    try {
        let user = Moralis.User.current();
        console.log(user)
        if(!user) {
            $('#logout_button').hide();
            $('#login_button').click(async () => {
                user = await Moralis.Web3.authenticate();
                window.location.reload();
            })
        } else {
            $('#logout_button').click(async () => {
                await Moralis.User.logOut();
                window.location.reload();
            })
        }
        ethereum.selectedAddress && user ? renderGame() : '';
    } catch (error) {
        console.log('error');
    }
}

async function renderGame() {
    interval();
    $('#login_button').hide();
    $('#plant_row').html('<div class="row" id="plant_row1"></div>');

    window.web3 = await Moralis.Web3.enable();
    let contract = await getContract();
    let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});

    var rowNo = 1;
    for(let i=0 ; i<array.length ; i++) {
        getPlantDetail(rowNo, i, array[i], contract);
    }

    $('#game').show();
}

async function getPlantDetail(rowNo, i, plantId, contract) {
    let details = await contract.methods.getTokenDetails(plantId).call({from: ethereum.selectedAddress});
    let plant = await renderPlant(plantId, details);
    if(i+1 % 5 === 0) {
        rowNo++;
        let htmlString = `<div class="row" id="plant_row${rowNo}"></div>`
        let element = $.parseHTML(htmlString);
        $('#plant_row').append(element);
        $(`#plant_row${rowNo}`).append(plant);
    } else {
        $(`#plant_row${rowNo}`).append(plant);
    }
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
    <div class="col-sm-3" style="padding-bottom:2rem; height:25rem;">
        <div class="card border-success card-detail" id="plant_${id}">
            <div class="card-header">Id: <span class="plant_id">#${id}</span></div>
            <div class="card-img" style="height: 13rem;">
                <img class="rounded mx-auto d-block ${data.plantType === 'Watermelon' ? 'watermelon_img' : 'plant_img'}" style="margin-top: 2.5rem;" src=${imgSrc}>
            </div>
            <div class="card-body">
                <div>Health: <span class="plant_health badge badge-danger">${data.health}</span></div>
                <div>Damage: <span class="plant_damage badge badge-primary">${data.damage}</span></div>
                <div>Type: <span class="plant_type badge badge-success">${data.plantType }</span></div>
            </div>
        </div>
    </div>`;

    let element = $.parseHTML(htmlString);
    return element;
}