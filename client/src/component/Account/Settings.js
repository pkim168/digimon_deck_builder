import React, { useEffect } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import UserInformation from './UserInformation.js';
import ProfileSettings from './ProfileSettings.js';
import { useHistory } from "react-router-dom";


function Settings (props) {
  const history = useHistory();

  useEffect(() => {
    props.setPageName("Settings");
    if (props.loaded) {
      if (!props.userDetails["username"]) {
        history.push('/');
      }
      props.setDisplay("none");
    }
  });

  return (
    <div className="container-fluid">
      <div className="row d-flex">
        <div className="col-xl-2 col-md-2 col-sm-12" style={{padding: "0px"}}>
          <div className="nav nav-pills flex-column" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-accountInformation-tab" data-toggle="pill" href="#v-pills-accountInformation" role="tab" aria-controls="v-pills-accountInformation" aria-selected="false">Account Information</a>
            <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a>
          </div>
        </div>
        <div className="col-xl-10 col-md-10 col-sm-12" style={{borderLeft: "3px solid black"}}>
          <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade show active" id="v-pills-accountInformation" role="tabpanel" aria-labelledby="v-pills-accountInformation-tab">
              <h1> Account Information </h1>
              <UserInformation {...props}/>
            </div>
            <div className="tab-pane fade show" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
              <h1> Profile Settings </h1>
              <ProfileSettings {...props}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings;
