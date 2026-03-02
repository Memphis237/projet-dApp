// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TaskManager {

    uint256 public taskCount;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);
    event TaskToggled(uint256 id, bool completed);
    event TaskEdited(uint256 id, string content);

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");

        taskCount++;

        tasks[taskCount] = Task(taskCount, _content, false);

        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        require(_id > 0 && _id <= taskCount, "Invalid task id");

        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;

        tasks[_id] = _task;

        emit TaskToggled(_id, _task.completed);
    }

    function editTask(uint256 _id, string memory _content) public {
        require(_id > 0 && _id <= taskCount, "Invalid task id");
        require(bytes(_content).length > 0, "Content cannot be empty");

        Task storage task = tasks[_id];
        task.content = _content;

        emit TaskEdited(_id, _content);
    }
}