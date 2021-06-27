import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddTask = () => {
  const [userList, setUserList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch("https://gh-task.herokuapp.com/allUser")
      .then((res) => res.json())
      .then((data) => setUserList(data));
  }, []);

  const onSubmit = (data, e) => {
    const displayName =
      userList &&
      userList.find((user) => data.userAssigned === user.email).displayName;
    data.startDate = startDate.toLocaleString("en-US").slice(0, 9);
    data.endDate = endDate.toLocaleString("en-US").slice(0, 9);
    data.userAssignedName = displayName;
    data.status = "Running";

    console.log(data);
    fetch("https://gh-task.herokuapp.com/addTask", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        data === false
          ? alert(
              "User is already working on this date, Please choose another date!!!"
            )
          : alert("Task is assigned to the user!!!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    e.target.reset();
  };

  return (
    <div className="mt-5 ml-5 w-50">
      <form className="border-0 shadow p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            placeholder="Enter Task Name"
            type="text"
            className="form-control"
            {...register("taskName", { required: true })}
          />
          {errors.taskName && (
            <span className="text-danger">This field is required</span>
          )}
        </div>
        <div className="form-group" noValidate>
          <label htmlFor="startDate">Start Date</label>
          <br />
          <DatePicker
            className="form-control w-100"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="form-group" noValidate>
          <label htmlFor="endDate">End Date</label>
          <br />
          <DatePicker
            className="form-control w-100"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <div className="input-group mb-3">
          <label htmlFor="userAssigned"></label>
          <select
            className="custom-select"
            id="userAssigned"
            {...register("userAssigned", { required: true })}
          >
            {userList.length === 0 ? (
              <option value="">Choose</option>
            ) : (
              userList?.map((user) => (
                <option defaultValue={user.email} value={user.email}>
                  {user.displayName}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="d-flex justify-content-center">
          <input className="form-control w-25 btn-dark" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddTask;
