import React from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { DropdownItem } from 'reactstrap';

function UserPanel(props) {

  return (
    <div id="UserPanel">
      {props.admin &&
        <div>
          <DropdownItem className="text-white" tag={Link} to="/admin" onClick={() => {
            props.onNavigate(null);
          }}>
            Admin Panel
          </DropdownItem>
          <DropdownItem divider />
        </div>
      }
      <DropdownItem className="text-white" tag={Link} to="/mydecks" onClick={() => {
        props.onNavigate(null);
      }}>
        My Decks
      </DropdownItem>
      <DropdownItem className="text-white" tag={Link} to="/settings" onClick={() => {
        props.onNavigate(null);
      }}>
        Settings
      </DropdownItem>
      <DropdownItem className="text-white" tag={Link} to="/" onClick={(e) => {
        props.service.Logout( () => {
          props.onLoginChange();
          props.onNavigate(null);
        }, (e) => {
          alert(e);
        });
      }}>
        Log Out
      </DropdownItem>
    </div>
  );
}



export default UserPanel;
