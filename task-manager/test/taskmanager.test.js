const { expect } = require("chai");

describe("TaskManager", function () {

  let taskManager;

  beforeEach(async function () {
    const TaskManager = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManager.deploy();
    // ethers v6 returns a deployed contract immediately, no need for .deployed()
  });

  it("Should create a task", async function () {
    await taskManager.createTask("Test");
    const task = await taskManager.tasks(1);
    expect(task.content).to.equal("Test");
  });

  it("Should toggle task", async function () {
    await taskManager.createTask("Toggle");
    await taskManager.toggleCompleted(1);
    const task = await taskManager.tasks(1);
    expect(task.completed).to.equal(true);
  });

  it("Should edit task content", async function () {
    await taskManager.createTask("Old");
    await taskManager.editTask(1, "New");
    const task = await taskManager.tasks(1);
    expect(task.content).to.equal("New");
  });

  it("Should revert if empty", async function () {
    await expect(taskManager.createTask(""))
      .to.be.revertedWith("Content cannot be empty");
  });

});