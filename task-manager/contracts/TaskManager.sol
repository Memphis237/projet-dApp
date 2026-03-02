// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract TaskManager {
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);
    event TaskToggled(uint256 id, bool completed);

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");

        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        require(_id > 0 && _id <= taskCount, "Invalid task id");

        Task storage task = tasks[_id];
        task.completed = !task.completed;

        emit TaskToggled(_id, task.completed);
    }
}