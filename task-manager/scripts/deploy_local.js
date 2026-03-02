const fs = require("fs");
const path = require("path");

async function main() {
  const TaskManager = await ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy();
  await taskManager.waitForDeployment();
  // ethers v6 provides getAddress() helper
  const addr = await taskManager.getAddress();
  console.log("TaskManager deployed to:", addr);

  // Sauvegarde l'adresse du contrat
  fs.writeFileSync(
    path.join(__dirname, "../frontend/config.js"),
    `const CONTRACT_ADDRESS = "${addr}";`
  );
  // copie l'ABI dans le dossier frontend pour que le serveur puisse y accéder
  const artifactSrc = path.join(__dirname, "../artifacts/contracts/TaskManager.sol/TaskManager.json");
  const artifactDst = path.join(__dirname, "../frontend/TaskManager.json");
  fs.copyFileSync(artifactSrc, artifactDst);
  console.log("Artifact copied to frontend");
  console.log("Config updated!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});