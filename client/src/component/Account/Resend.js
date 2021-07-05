import React, { useEffect } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

function Resend (props){
  const history = useHistory();
  const setDisplay = props.setDisplay;

  useEffect(() => {
    props.setPageName("Resend Email");
    let mounted = true;
    if (mounted)
      setDisplay("none");
    return () => mounted = false;
  });

  return (
    <div className="container-fluid" style={{height: "100vh"}}>
      <div className="d-flex justify-content-center align-items-center flex-grow-1 h-100">
        <div className="d-flex col-8 bg-dark text-white" style={{borderRadius: "10px 10px 10px 10px", padding: "1rem"}}>
          <Form className="px-4 py-3 flex-grow-1" id="filter" onSubmit={(e) => {
            e.preventDefault();
            var email = document.getElementById("resendEmail").value;
            props.service.Post("/resend", {email: email}, () => {
              props.onNavigate(null);
              history.push('/');
              alert("Confirmation email has been sent.");
            }, (error) => {
              alert(error);
            });
          }}>
            <h5> Resend Verification Email </h5>
            <FormGroup row>
              <Label for="resendEmail"> Email </Label>
              <Input name="resendEmail" id="resendEmail" placeholder="Required" required="required" />
            </FormGroup>
            <FormGroup row>
              <div className="btn-group w-100" role="group">
                <Button className="w-100" type="submit" color="success"> Resend Verification Email </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Resend;
