import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, ButtonGroup } from "reactstrap";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";

function LoginRegister(props) {
  const [component, setComponent] = useState("Login");

  function buildComponentMap() {
    return {
        "Login": <Login service={props.service} onLoginChange={props.onLoginChange} changeSelected={props.changeSelected} onNavigate={props.onNavigate}/>,
        "Register": <Register service={props.service} onLoginChange={props.onLoginChange} onNavigate={props.onNavigate}/>
    };
  }

  return (
    <div>
      <Form>
        <div className="btn-group d-flex flex-row flex-wrap" role="group">
          <button type="button" className="btn btn-secondary" onClick={() => setComponent("Login")}>Login</button>
          <button type="button" className="btn btn-secondary" onClick={() => setComponent("Register")}>Register</button>
        </div>
      </Form>
      <div className="LoginRegister d-flex flex-row flex-wrap">
        <div className="p-2" style={{flex: 1}}>
          {buildComponentMap()[component]}
        </div>
      </div>
    </div>
  );
}

function Login(props) {
  return (
    <div>
      <Form className="px-4 py-3" id="login" onSubmit={(e) => {
        e.preventDefault();
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        props.service.Login(email, password, () => {
          props.onLoginChange();
        }, (e) => {
          alert(e);
        });
      }}>
        <h5> Login </h5>
        <FormGroup>
          <Label for="loginEmail"> Email </Label>
          <Input type="loginEmail" name="loginEmail" id="loginEmail" placeholder="Email" required="required" />
        </FormGroup>
        <FormGroup>
          <Label for="loginPassword"> Password </Label>
          <Input type="password" name="loginPassword" id="loginPassword" placeholder="********" required="Required"/>
        </FormGroup>
        <ButtonGroup>
          <Button type="reset" color="danger"> Clear </Button>
          <Button type="submit" color="success"> Login </Button>
        </ButtonGroup>
      </Form>
      <div className="px-4 py-3" >
        <div className="col">
          <div className="row">
            <a href="/password" onClick={() => {
              props.onNavigate(null);
            }}> Forgot Password? </a>
          </div>
          <div className="row">
            <a href="/resend" onClick={() => {
              props.onNavigate(null);
            }}> Resend Verification Email </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Register(props) {
  const history = useHistory();
  return (
    <Form className="px-4 py-3" id="register" onSubmit={(e) => {
      e.preventDefault();
      let email = document.getElementById("registerEmail").value;
      let username = document.getElementById("username").value;
      let firstName = document.getElementById("firstName").value;
      let lastName = document.getElementById("lastName").value;
      let password = document.getElementById("registerPassword").value;
      if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
      props.service.Register(email, username, firstName, lastName, password, () => {
        document.getElementById("registerEmail").value = '';
        document.getElementById("username").value = '';
        document.getElementById("firstName").value = '';
        document.getElementById("lastName").value = '';
        document.getElementById("registerPassword").value = '';
        props.onNavigate(null);
        history.push('/');
        alert("Confirmation email has been sent.");
      }, (e) => {
        alert(e);
      });
    }}>
      <h5> Register </h5>
      <FormGroup>
        <Label for="registerEmail"> Email </Label>
        <Input type="registerEmail" name="registerEmail" id="registerEmail" placeholder="Required" required="required" />
      </FormGroup>
      <FormGroup>
        <Label for="username"> Username </Label>
        <Input type="username" name="username" id="username" placeholder="Required" required="required" />
      </FormGroup>
      <div className="d-flex flex-wrap justify-content-between">
        <div style={{flex: 1}}>
          <FormGroup>
            <Label for="firstName"> First Name </Label>
            <Input type="text" name="firstName" id="firstName" placeholder="Optional"/>
          </FormGroup>
        </div>
        <div style={{flex: 1}}>
          <FormGroup>
            <Label for="lastName"> Last Name </Label>
            <Input type="text" name="lastName" id="lastName" placeholder="Optional"/>
          </FormGroup>
        </div>
      </div>
      <FormGroup>
        <Label for="registerPassword"> Password </Label>
        <Input type="password" name="registerPassword" id="registerPassword" placeholder="********" required="Required"/>
      </FormGroup>
      <ButtonGroup>
        <Button type="reset" color="danger"> Clear </Button>
        <Button type="submit" color="success"> Register </Button>
      </ButtonGroup>
    </Form>
  )
}

export default LoginRegister;
