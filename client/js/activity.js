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
    $('#activity_ul').html('');

    window.web3 = await Moralis.Web3.enable();
    let contract = await getContract();
    let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});

    array.forEach(async (plantId) => {
        let details = await contract.methods.getTokenDetails(plantId).call({from: ethereum.selectedAddress});
        renderActivity(plantId, details);
    });
}

function renderActivity(id, data) {
    let htmlString = `<li class="list-group-item">Acquired #${id} ${timeConverter(data.date)}</li>`;
    let element = $.parseHTML(htmlString);
    $('#activity_ul').append(element);
}

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