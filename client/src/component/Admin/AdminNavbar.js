import React from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function AdminNavbar(props) {

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light py-3 shadow-sm fixed-bottom justify-content-between">
      <a className="navbar-brand" href="/#"> Admin Panel </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav mr-auto">
          <a className="nav-link" href="/#" onClick={(e) => {
            e.preventDefault();
            props.service.Post("/cards/update", '', (data) => {
              alert("Update Finished")
            }, (error) => {
              alert(error);
            })
          }}> Update Card Database </a>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
