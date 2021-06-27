import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AddTask from "../AddTask/AddTask";
import Sidebar from "../Sidebar/Sidebar";
import TaskList from "../TaskList/TaskList";

const Dashboard = () => {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Sidebar></Sidebar>
      <div className="content bg-light">
        <Switch>
          <Route exact path={`${path}/`}>
            <TaskList></TaskList>
          </Route>
          <Route path={`${path}/taskList`}>
            <TaskList></TaskList>
          </Route>
          <Route path={`${path}/addTask`}>
            <AddTask></AddTask>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;
