const hre = require("hardhat");

async function main() {
const TaskManager = await hre.ethers.getContractFactory("TaskManager");
const taskManager = await TaskManager.deploy(); // déjà déployé après await deploy()

console.log("TaskManager deployed to:", taskManager.target); // ethers v6 : target contient l'adresse
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});