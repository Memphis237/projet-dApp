# Task Manager dApp

Ce dépôt contient un contrat Solidity simple de gestion de tâches (`TaskManager.sol`), des scripts Hardhat pour compiler, tester et déployer localement, ainsi qu'un frontend HTML/JS qui interagit avec le contrat via `ethers.js`.

## 📦 Installation

```bash
# récupérer les dépendances Node
npm install
```

Le projet utilise Hardhat et la boîte à outils `@nomicfoundation/hardhat-toolbox`.

## 🔧 Compilation & tests

Compilez les contrats et exécutez la suite de tests :

```bash
npm run compile    # hardhat compile
npm test           # hardhat test
```

Les tests vérifient la création de tâches, le changement d'état et la gestion des erreurs.

## 🚀 Lancement d'un nœud local

Pour simuler un réseau Ethereum local :

```bash
npm run node       # démarre Hardhat node sur http://127.0.0.1:8545
```

Gardez ce terminal ouvert pendant que vous déployez et utilisez le frontend.

## 💾 Déploiement local

Une fois le nœud actif, déployez le contrat :

```bash
npm run deploy:local
```

Ce script :

1. utilise `hardhat run scripts/deploy_local.js --network localhost`
2. récupère l'adresse renvoyée par le contrat
3. génère (ou met à jour) `frontend/config.js` avec cette adresse
4. copie l'artefact ABI dans `frontend/TaskManager.json` pour le frontend

Si vous préférez ne pas générer de fichier externe, référez-vous à la section **Renseigner l'adresse / ABI** ci‑dessous.

## 🌐 Lancement du frontend

Servez le dossier `frontend` avec un serveur statique quelconque (par exemple `serve` ou `http-server`).

```bash
npm run serve        # équivalent à "npx serve frontend"
```

Ouvrez ensuite le navigateur sur l'URL affichée (généralement `http://localhost:5000`).

Le frontend tentera de se connecter à MetaMask ; s'il n'est pas disponible, il se rabattra automatiquement sur le nœud local.

## 🛠 Où renseigner l'adresse du contrat et l'ABI ?

### Option 1 : fichiers (par défaut)

Le déploiement écrit automatiquement :

- `frontend/config.js` contenant :
  ```js
  const CONTRACT_ADDRESS = "0x...";
  ```
- `frontend/TaskManager.json` contenant l'ABI complète du contrat

Le script `app.js` lit `config.js` ou inclut l'adresse et charge l'ABI par `fetch("./TaskManager.json")`.

### Option 2 : tout inline dans `app.js`

Si vous préférez empêcher la génération de fichiers externes, vous pouvez :

1. Supprimer l'inclusion `<script src="config.js"></script>` dans `frontend/index.html`.
2. Copier manuellement l'adresse (issue de `npm run deploy:local`) dans une constante `const CONTRACT_ADDRESS = "...";` en haut de `app.js`.
3. Coller également l'ABI (le tableau `abi` présent dans `TaskManager.json`) dans une variable `const ABI = [...]` dans `app.js`.

Le reste du code n'a pas besoin d'être modifié.

---

Avec ces étapes vous pouvez recompiler, tester, déployer et utiliser la dApp en local, qu'il y ait ou non MetaMask. Bon développement !