const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const TaskManager = await hre.ethers.getContractFactory("TaskManager");
    const taskManager = await TaskManager.deploy();

    console.log("\n✅ TaskManager deployed with success!");
    console.log("📍 Contract Address:", taskManager.target);

    // Écrire l'adresse dans contract-config.js
    const configPath = path.join(__dirname, "../frontend/contract-config.js");
    const configContent = `// Auto-updated by deploy script
export const CONTRACT_ADDRESS = "${taskManager.target}";
`;
    
    fs.writeFileSync(configPath, configContent);
    console.log("✅ contract-config.js updated!");
    console.log("\nYou can now open http://localhost:3000 in your browser!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });