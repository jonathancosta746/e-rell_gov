import React from 'react'

//components
import CreateTask from '../../components/CreateTask'
import Tasks from '../../components/tasks'
import NavBar from '../../components/navBar'

const Dashboard = () => {
  return (
    <div>
        <NavBar/>
        <Tasks />
        <CreateTask />
    </div>
    )
}

export default Dashboard