import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.1/dist/ethers.min.js";
import { CONTRACT_ABI } from "./abi.js";
import { CONTRACT_ADDRESS } from "./contract-config.js";

let provider, signer, contract;
const statusEl = document.getElementById("status");

async function init() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
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