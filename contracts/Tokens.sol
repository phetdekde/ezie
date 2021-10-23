pragma solidity ^0.8.9;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Token is ERC721, Ownable {

    struct Pet {
        uint8 health; //0-255
        uint8 damage; //0-255
        string plantType;
        uint256 date;
    }

    uint256 nextId = 0;

    mapping(uint256 => Pet) private _tokenDetails;
    mapping (uint256 => uint256) private tokenIdToPrice;

    constructor() ERC721("Ezie", "EZ") {
    }

    function getTokenDetails(uint256 tokenId) public view returns (Pet memory) {
        return _tokenDetails[tokenId];
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return tokenIdToPrice[tokenId];
    }

    function getAllSellingTokens() public view returns (uint256[] memory) {
        uint256 size;
        uint256 totalPets = nextId;
        uint256 resultIndex = 0;
        uint256 i;
        for(i = 0; i < totalPets; i++) {
            if(tokenIdToPrice[i] != 0) {
                size++;
            }
        }
        uint[] memory result = new uint256[](size);
        for(i = 0; i < totalPets; i++) {
            if(tokenIdToPrice[i] != 0) {
                result[resultIndex] = i;
                resultIndex++;
            }
        }
        return result;
    }

    function mint(uint256 date) external {
        uint8 randHP = randomHP(156);
        uint8 randDMG = randomATK(156, randHP);
        string memory plantType;
        uint randType = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty))) % 3;
        if(randType == 0) {
            plantType = "Sunflower";
        } else if(randType == 1) {
            plantType = "Peashooter";
        } else {
            plantType = "Watermelon";
        }

        _tokenDetails[nextId] = Pet(randHP, randDMG, plantType, date);
        _safeMint(msg.sender, nextId);
        nextId++;
    }

    function allowBuy(uint256 _tokenId, uint256 _price) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        require(_price > 0, 'Price zero');
        tokenIdToPrice[_tokenId] = _price;
    }

    function disallowBuy(uint256 _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        tokenIdToPrice[_tokenId] = 0;
    }
    
    function buy(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, 'This token is not for sale');
        require(msg.value == price, 'Incorrect value');
        
        address seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
        tokenIdToPrice[_tokenId] = 0; // not for sale anymore
        payable(seller).transfer(msg.value); // send the ETH to the seller
    }

    function getAllTokensForUser(address user) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0) {
            return new uint256[](0);
        } 
        else {
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalPets = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalPets; i++) {
                if(ownerOf(i) == user) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function randomHP(uint mod) internal view returns (uint8) {
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty))) % mod;
        randomNumber = randomNumber + 100;
        return uint8(randomNumber);
    }

    function randomATK(uint mod, uint rand) internal view returns (uint8) {
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, rand, block.difficulty))) % mod;
        return uint8(randomNumber);
    }
}