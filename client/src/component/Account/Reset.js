import React, { useEffect, useCallback, useState } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from "react-router-dom";

function Reset (props) {
  const history = useHistory();
  const setDisplay = props.setDisplay;
  const [validToken, setValidToken] = useState(false);
  const [show, setShow] = useState(false);
  let mParams = useParams();

  const getData = useCallback((mounted) => {
    props.service.Post("/reset", {token: mParams.token}, (data) => {
      // put data into local storage
      if (mounted) {
        setValidToken(true);
        setShow(true);
        setDisplay("none");
      }
    }, (error) => {
      console.log(error)
      setValidToken(false);
      setShow(true);
      setDisplay("none");
    });
  }, [props.service, setDisplay, mParams.token]);

  useEffect(() => {
    let mounted = true;
    if (props.loaded) {
      if (mounted)
        getData(mounted);
    }
    return () => mounted = false;
  },[getData, props.loaded, history, props.userDetails]);

  return (
      <div className="d-flex row justify-content-center align-items-center" style={{height: "100vh"}}>
        {show && props.loaded && validToken &&
          <h1 className="bg-dark text-white" style={{borderRadius: "10px 10px 10px 10px", padding: "1rem", color: "black"}}> Password has been reset. Please check your email for your new password </h1>
        }
        {show && props.loaded && !validToken &&
          <div className="bg-dark text-white" style={{borderRadius: "10px 10px 10px 10px", padding: "1rem"}}>
            <h1 > Reset Failed. Link has expired </h1>
            <a href="/password"> Reset Password </a>
          </div>
        }
      </div>
  );
}
export default Reset;
