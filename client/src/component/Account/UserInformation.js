import React, {useState} from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";

function UserProfile(props) {
  const history = useHistory();
  const [firstName, setFirstName] = useState(props.userDetails["firstName"]);
  const [lastName, setLastName] = useState(props.userDetails["lastName"]);

  return (
    <div className="account-info-list">
      <div className="accountInformation">
        <div className="account-info-container col">
          <div className="row">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Email </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" id="email" value={props.userDetails["email"]} disabled/>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Username </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" id="username" value={props.userDetails["username"]} disabled/>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> First Name </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" id="firstName" value={firstName} onChange={(e) => {
                setFirstName(e.target.value);
              }}/>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Last Name </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" id="lastName" value={lastName} onChange={(e) => {
                setLastName(e.target.value);
              }}/>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Password </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" type="password" id="password" placeholder="********"/>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Confirm Password </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" type="password" id="confirmPassword" placeholder="********"/>
            </InputGroup>
          </div>
        </div>
        <div className="row">
          <div className="col btn-group">
            <button type="button" className="btn w-100 btn-success"  onClick={(e) => {
              e.preventDefault();
              let firstName = document.getElementById("firstName").value;
              let lastName = document.getElementById("lastName").value;
              let password = document.getElementById("password").value;
              let confirmPassword = document.getElementById("confirmPassword").value;
              if (password.length < 8 && password.length > 0) {
                alert("Password must be at least 8 characters");
                return;
              }
              if (password !== confirmPassword) {
                alert("Passwords must match");
                return;
              }
              props.service.Update(props.userDetails["email"], firstName, lastName, password, () => {
                props.service.Logout( () => {
                  history.push('/');
                  props.onNavigate(null);
                }, (e) => {
                  alert(e);
                });
              }, (e) => {
                alert(e);
              });
            }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
