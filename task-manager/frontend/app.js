import { ethers } from "./ethers-6.esm.min.js"; // ou via npm
import CONTRACT_ABI from "./TaskManager.json" assert { type: "json" };

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // remplace par l'adresse du contrat déployé

let provider, signer, contract;
const statusEl = document.getElementById("status");

async function init() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
        console.log("Contrat connecté :", contract.target);
        await loadTasks();
    } else {
        alert("Installe MetaMask ou utilise un provider local !");
    }
}

async function loadTasks() {
    const taskCount = await contract.taskCount();
    const tasksList = document.getElementById("tasksList");
    tasksList.innerHTML = "";

    for (let i = 1; i <= taskCount; i++) {
        const task = await contract.tasks(i);
        const li = document.createElement("li");
        li.textContent = task.content;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTask(i);
        li.prepend(checkbox);
        tasksList.appendChild(li);
    }
}

async function createTask(content) {
    try {
        statusEl.textContent = "Transaction en cours…";
        const tx = await contract.createTask(content);
        await tx.wait();
        statusEl.textContent = "Tâche créée !";
        await loadTasks();
    } catch (err) {
        console.error(err);
        statusEl.textContent = "Erreur lors de la création de la tâche.";
    }
}

async function toggleTask(id) {
    try {
        statusEl.textContent = "Transaction en cours…";
        const tx = await contract.toggleCompleted(id);
        await tx.wait();
        statusEl.textContent = "Tâche mise à jour !";
        await loadTasks();
    } catch (err) {
        console.error(err);
        statusEl.textContent = "Erreur lors du toggle de la tâche.";
    }
}

document.getElementById("addTaskBtn").onclick = () => {
    const input = document.getElementById("taskInput");
    if (input.value.trim()) {
        createTask(input.value.trim());
        input.value = "";
    }
};

init();