const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
let contract;
let signer;

async function init() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  const response = await fetch("../artifacts/contracts/TaskManager.sol/TaskManager.json");
  const data = await response.json();

  contract = new ethers.Contract(CONTRACT_ADDRESS, data.abi, signer);

  loadTasks();
}

async function loadTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const count = await contract.taskCount();

  for (let i = 1; i <= count; i++) {
    const task = await contract.tasks(i);

    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      ${task.content}
      <input type="checkbox" ${task.completed ? "checked" : ""} 
        onchange="toggleTask(${task.id})">
    `;

    taskList.appendChild(li);
  }
}

async function createTask() {
  const input = document.getElementById("taskInput");
  const status = document.getElementById("status");

  if (!input.value) return;

  status.innerText = "Transaction en cours...";

  const tx = await contract.createTask(input.value);
  await tx.wait();

  status.innerText = "Tâche ajoutée ✅";
  input.value = "";
  loadTasks();
}

async function toggleTask(id) {
  const status = document.getElementById("status");
  status.innerText = "Transaction en cours...";

  const tx = await contract.toggleCompleted(id);
  await tx.wait();

  status.innerText = "Statut mis à jour ✅";
  loadTasks();
}

init();