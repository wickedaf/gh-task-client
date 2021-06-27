import React, { useContext, useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";

const TaskList = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusState, setStatusState] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("https://gh-task.herokuapp.com/allTask?email=" + loggedInUser.email)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [loggedInUser.email, statusState]);

  useEffect(() => {
    fetch("https://gh-task.herokuapp.com/adminCheck?email=" + loggedInUser.email)
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });
  }, [loggedInUser.email]);

  const handleStatus = (taskID, event) => {
    const status = event.target.value;
    const statusData = {
      taskID,
      status: status,
    };

    fetch("https://gh-task.herokuapp.com/updateStatus", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(statusData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Data Updated", data);
        alert(`Status updated to ${status}`);
        setStatusState(!statusState);
      });
  };

  const handleSearch = (event) => {
    let searchStr = event.target.value.toLowerCase();
    let result = [];
    result =
      tasks &&
      tasks.filter((obj) =>
        Object.values(obj).some((val) => val.toLowerCase().includes(searchStr))
      );
    setFilteredData(result);
    console.log(filteredData, searchStr)
  };

  return (
    <div className="ml-5 my-5">
      {isAdmin && (
        <div className="d-flex justify-content-between my-2">
          <div>
            <input
              className="rounded border-secondary form-control-md"
              type="text"
              name="search"
              id=""
              placeholder="Search Here..."
              onChange={(event) => handleSearch(event)}
            />
          </div>
          <div>
            <Link className="lead text-decoration-none" to="/dashboard/addTask">
              <button className="btn btn-primary d-block">Add Task</button>
            </Link>
          </div>
        </div>
      )}
      <Table
        striped
        hover
        className="shadow rounded-lg border-0 table-responsive-sm"
      >
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Task Status</th>
            {!isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0
            ? tasks?.map((task, i) => (
                <tr key={i}>
                  <td>{task.userAssignedName}</td>
                  <td>{task.userAssigned}</td>
                  <td>{task.taskName}</td>
                  <td>{task.startDate}</td>
                  <td>{task.endDate}</td>
                  <td>{task.status}</td>
                  <td className="text-success">
                    {isAdmin ? (
                      <Form.Control
                        onChange={(event) => handleStatus(task._id, event)}
                        as="select"
                        className="mr-sm-2"
                        id="inlineFormCustomSelect"
                        custom
                        disabled
                      >
                        <option value={task.status}>{task.status}</option>
                      </Form.Control>
                    ) : (
                      <Form.Control
                        onChange={(event) => handleStatus(task._id, event)}
                        as="select"
                        className="mr-sm-2"
                        id="inlineFormCustomSelect"
                        custom
                      >
                        <option value="">Choose...</option>
                        <option value="Running">Running</option>
                        <option value="Expired">Expired</option>
                        <option value="Done">Done</option>
                      </Form.Control>
                    )}
                  </td>
                </tr>
              ))
            : filteredData.map((task, i) => (
                <tr key={i}>
                  <td>{task.userAssignedName}</td>
                  <td>{task.userAssigned}</td>
                  <td>{task.taskName}</td>
                  <td>{task.startDate}</td>
                  <td>{task.endDate}</td>
                  <td className="text-success">
                    {isAdmin ? (
                      <Form.Control
                        onChange={(event) => handleStatus(task._id, event)}
                        as="select"
                        className="mr-sm-2"
                        id="inlineFormCustomSelect"
                        custom
                        disabled
                      >
                        <option value={task.status}>{task.status}</option>
                      </Form.Control>
                    ) : (
                      <Form.Control
                        onChange={(event) => handleStatus(task._id, event)}
                        as="select"
                        className="mr-sm-2"
                        id="inlineFormCustomSelect"
                        custom
                      >
                        <option value={task.status}>{task.status}</option>
                        <option value="Pending">Running</option>
                        <option value="Ongoing">Expired</option>
                        <option value="Done">Done</option>
                      </Form.Control>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskList;
