const DoroToken = artifacts.require("./DoroToken.sol");
const DoroSale = artifacts.require("./DoroSale.sol");

module.exports = function(deployer) {
  deployer.deploy(DoroToken).then( () => {
    const tokenPrice = 6389183492737200;
    return deployer.deploy(DoroSale, DoroToken.address, tokenPrice);
  }); 

};