const { expect } = require("chai");

describe("TaskManager", function () {

let TaskManager;
let taskManager;

beforeEach(async function () {
    TaskManager = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManager.deploy();
    await taskManager.waitForDeployment();
});

it("Should create a task", async function () {
    const tx = await taskManager.createTask("Ma première tâche");
    await tx.wait();

    const count = await taskManager.taskCount();
    expect(count).to.equal(1);

    const task = await taskManager.tasks(1);
    expect(task.content).to.equal("Ma première tâche");
    expect(task.completed).to.equal(false);
});

it("Should toggle a task", async function () {
    await taskManager.createTask("Test toggle");

    await taskManager.toggleCompleted(1);

    const task = await taskManager.tasks(1);
    expect(task.completed).to.equal(true);
});

it("Should revert if content is empty", async function () {
    await expect(
    taskManager.createTask("")
    ).to.be.reverted;
});

});