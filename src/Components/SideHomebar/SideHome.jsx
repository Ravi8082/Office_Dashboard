import React from 'react'
import './SideHome.css'
function SideHome() {
  return (
    <div>
        <div className="box">
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Home
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="employeeList.html">Employee List</a></li>
                        <li><a className="dropdown-item" href="updateatendence.html">Update Attendance</a></li>
                        <li><a className="dropdown-item" href="addnewemployee.html">Add New Employee</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><a className="dropdown-item" href="#">ONE</a></li>
                    </ul>
                </div>
            </div>
            <div className="d-flex three">
                <div className="notice">
                    <p className="N"><b>Notice</b></p>
                </div>
                <div className="notice">
                    <p className="N"><b>Attendance</b></p>
                </div>
            </div>

    </div>
  )
}

export default SideHome