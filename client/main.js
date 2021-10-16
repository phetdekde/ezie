Moralis.initialize("o113qwSsl3hbQrRwTQeAhG1Bydxf3jxq0xUONhzX"); // Application id from moralis.io
Moralis.serverURL = "https://qexoyo0cyt3t.grandmoralis.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = '0xe6f2DeA2D43DB4EdD45295cAe568D522daf4Bd55';

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
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
    array.forEach(async (plantId) => {
        let details = await contract.methods.getTokenDetails(plantId).call({from: ethereum.selectedAddress});
        console.log(details)
        renderPlant(plantId, details);
        renderActivity(plantId, details);
    });

    renderAccount();

    $('#game').show();
}

async function renderAccount() {
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let totalPlants = await contract.methods.balanceOf(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
    $('#total_plants').html(`You currently have ${totalPlants} plants!`)
}

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

function renderActivity(id, data) {
    let htmlString = `<li class="list-group-item">Acquired #${id} ${timeConverter(data.date)}</li>`;
    let element = $.parseHTML(htmlString);
    $('#activity_ul').append(element);
}

function getAbi() {
    return new Promise((res) => {
        $.getJSON('Token.json', ((json) => {
            res(json.abi);
        }))
    })
}

$('#mint_button').click(async () => {
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let dateInAWeek = new Date();
    dateInAWeek.setDate(dateInAWeek.getDate() + 7);
    const deadline = Math.floor(dateInAWeek.getTime() / 1000);
    await contract.methods.mint(deadline).send({from: ethereum.selectedAddress}).on('receipt', (receipt) => {
        console.log(receipt);
        renderGame();
    });
});


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

init();