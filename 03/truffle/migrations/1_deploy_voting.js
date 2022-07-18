const voting = artifacts.require("Voting");

module.exports = function (deployer) {
  console.log(deployer)
  deployer.deploy(voting);
};
