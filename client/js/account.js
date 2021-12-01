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
    $('#activity_ul').html('');

    window.web3 = await Moralis.Web3.enable();
    let contract = await getContract();
    let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});

    for(let i=array.length-1 ; i>array.length-6 ; i--) {
        let details = await contract.methods.getTokenDetails(array[i]).call({from: ethereum.selectedAddress});
        renderActivity(array[i], details);
    }
    renderAccount();
}
 
async function renderAccount() {
    let contract = await getContract();
    let totalPlants = await contract.methods.balanceOf(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
    $('#total_plants').html(`<h2>You currently have <span class="badge badge-success">${totalPlants}</span> plants!</h2>`)
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