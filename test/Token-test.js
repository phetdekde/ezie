const { assert } = require('chai');

const Token = artifacts.require('Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
    let contract

    before(async() => {
        contract = await Token.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async () => {
            const address = contract.address
            // console.log('==============' + address + '==============');
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Ezie')
        })

        it('has a symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'EZ')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            const result = await contract.mint(199, 99, 100000);
            const total = await contract.balanceOf('0x9E1D2478B11E2649BaB3985D6a433dCd5D93518d');
            assert.equal(total, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 0, 'id is correct');
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
            assert.equal(event.to, accounts[0], 'to is correct');
        })
    })

    describe('indexing', async () => {
        it('lists colors', async () => {
            //Mint 3 more tokens O_O
            await contract.mint(99, 9, 100000);
            await contract.mint(199, 99, 200000);
            await contract.mint(255, 255, 300000);
            const totalSupply = await contract.balanceOf(accounts[0]);
            
            for(var i = 0 ; i<=totalSupply ; i++) {
                console.log(contract.getTokenDetails(i));
            }

            assert.equal(totalSupply, 4, 'total is correct');
        })
    })
})