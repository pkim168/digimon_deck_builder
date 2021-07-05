import React, {useState} from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginRegister from './LoginRegister.js';
import UserPanel from './UserPanel.js';
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';

function TopNavbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  function rightNavigation() {
    let rightNav = [];
    for (let i = 0; i < props.rightNav.length; i++) {
      // let click = () => {
      //   setSelected(props.rightNav[i]);
      //   props.onNavigate(props.rightNav[i], null);
      // };
      if (props.rightNav[i] === "Login/Register"){
        rightNav.push(
          <UncontrolledDropdown id="login-register-dropdown" key={props.rightNav[i]} nav inNavbar>
            <DropdownToggle nav caret>
              Login/Register
            </DropdownToggle>
            <DropdownMenu className="bg-dark" id="login-register-window" right>
              <LoginRegister service={props.service} onLoginChange={props.onLoginChange} onNavigate={props.onNavigate} />
            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
      if (props.rightNav[i] === "User Panel"){
        rightNav.push(
          <UncontrolledDropdown key={props.rightNav[i]} nav inNavbar>
            <DropdownToggle nav caret>
              {props.userDetails["username"]}
            </DropdownToggle>
            <DropdownMenu className="bg-dark" id="userpanel-window" right>
              <UserPanel service={props.service} admin={props.admin} userDetails={props.userDetails} onLoginChange={props.onLoginChange} onNavigate={props.onNavigate}/>
            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
    }
    return rightNav;
  }

  return (

    <Navbar className="py-3 shadow-sm fixed-top justify-content-between navbar-custom" dark expand="lg">
      <NavbarBrand tag={Link} to="/">DigiDecks</NavbarBrand>
      <NavbarText style={{padding:"0"}}> <h2 style={{color: "white", margin:"0", paddingRight: "1rem"}}>| </h2> </NavbarText>
      <NavbarText className="mr-auto" > <h5 style={{color: "white", margin:"0", paddingRight: "2rem"}}>{props.pageName}</h5> </NavbarText>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>

          <NavItem>
            <NavLink tag={Link} to="/deckbuilder"> Deck Builder </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/carddb"> Card Database </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/deckdb"> Deck Database </NavLink>
          </NavItem>
        </Nav>
        <Nav className="in-line" navbar>
          {rightNavigation()}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default TopNavbar;
