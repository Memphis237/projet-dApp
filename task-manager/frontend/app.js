import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.1/dist/ethers.min.js";
import { CONTRACT_ABI } from "./abi.js";
import { CONTRACT_ADDRESS } from "./contract-config.js";

let provider, signer, contract;
const statusEl = document.getElementById("status");

async function init() {
    // si MetaMask est installé et connecté, on l'utilise
    if (window.ethereum && window.ethereum.isMetaMask) {
        provider = new ethers.BrowserProvider(window.ethereum);
        try {
            await provider.send("eth_requestAccounts", []); // demande l'accès au compte
        } catch (e) {
            console.warn("Accès MetaMask refusé, passage au provider local");
        }
        signer = await provider.getSigner();
    } else {
        // pas de MetaMask : on se rabat sur un provider JSON-RPC local
        console.log("MetaMask non détecté, utilisation du provider local http://127.0.0.1:8545");
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = provider.getSigner(); // renvoie le premier compte du nœud Hardhat
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Contrat connecté :", contract.target);
    await loadTasks();
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