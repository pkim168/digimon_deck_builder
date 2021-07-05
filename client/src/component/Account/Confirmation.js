import React, { useEffect, useCallback, useState } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from "react-router-dom";

function Confirmation (props) {
  const history = useHistory();
  const setDisplay = props.setDisplay;
  const [validToken, setValidToken] = useState(false);
  const [show, setShow] = useState(false);
  let mParams = useParams();
  const setPageName = props.setPageName;

  const getData = useCallback((mounted) => {
    props.service.Post("/confirmation", {token: mParams.token}, (data) => {
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
    setPageName("Confirmation");
    let mounted = true;
    if (props.loaded) {
      if (mounted)
        getData(mounted);
    }
    return () => mounted = false;
  },[getData, props.loaded, history, setPageName]);

  return (
      <div className="d-flex row justify-content-center align-items-center" style={{height: "100vh"}}>
        {show && props.loaded && validToken &&
          <h1 className="bg-dark text-white" style={{borderRadius: "10px 10px 10px 10px", padding: "1rem", color: "black"}}>Email Confirmed</h1>
        }
        {show && props.loaded && !validToken &&
          <div className="bg-dark text-white" style={{borderRadius: "10px 10px 10px 10px", padding: "1rem"}}>
            <h1 >Confirmation Failed. Link has expired</h1>
            <a href="/resend"> Resend Verification Email </a>
          </div>
        }
      </div>
  );
}
export default Confirmation;
