//import request from "request";
import CookieController from "./CookieController";
import config from './config';
const axios = require("axios");
let routing = "//" + config.apiEndPoint.hostname + ":" + config.apiEndPoint.port;
if (config.apiEndPoint.routingPrefix !== "") {
  routing += "/" + config.apiEndPoint.routingPrefix;
}

class APIService {
  constructor() {
    this.CookieController = new CookieController();
    this.accesstoken = this.CookieController.GetCookies()["accessToken"];
    this.Authorized = false;
    this.Logout = this.Logout.bind(this);
    this.Login = this.Login.bind(this);
    this.Register = this.Register.bind(this);
  }

  CheckAuthorization() {
    if (this.accesstoken) {
      this.Authorized = true;
    }
  }

  Logout(onCompleted, onError) {
    this.Authorized = false;
    window.dispatchEvent(new CustomEvent("_event_onLoginChange"), { detail: { loggedin: false } });
    this.accesstoken = '';
    this.CookieController.PutCookie("accessToken", "");
    onCompleted();
  }

  Login(email, password, onCompleted, onError) {
    axios.post(routing + "/login", {
      email: email,
      password: password
    })
    .then((response) => {
      let data = response["data"];
      this.Authorized = true;
      this.accesstoken = data["token"];
      this.CookieController.PutCookie("accessToken", data["token"]);
      window.dispatchEvent(new CustomEvent("_event_onLoginChange"), { detail: { loggedin: true } });
      if (onCompleted) {
        onCompleted();
      }
    })
    .catch((error) => {
      this.Authorized = false;
      if (error.response) {
        if (onError) {
          onError("Login Failed: " + error.response["data"]["message"]);
        }
      }
      else if (onError) {
        onError("Login Failed");
      }
    });
  }

  Get(path, params, onCompleted, onError) {
    axios.get(routing + path, {
      headers: {
        "X-Access-Token": this.accesstoken
      },
      params: params
    })
    .then((response) => {
      onCompleted(response["data"]);
    })
    .catch((error) => {
      if (error.response) {
        if (onError) {
          onError(error.response["data"]["message"]);
        }
      }
      else if (onError) {
        onError("Unexpected Error" + onError);
      }

    })
  }

  Post(path, params, onCompleted, onError) {
    axios.post(routing + path, params, {
      headers: {
        "X-Access-Token": this.accesstoken
      }
    })
    .then((response) => {
      if(onCompleted){
        onCompleted(response["data"]["message"]);
      }
    })
    .catch((error) => {
      if (error.response) {
        if (onError) {
          onError(error.response["data"]["message"]);
        }
      }
      else if (onError) {
        onError("Unexpected Error");
      }
    });
  }

  Register(email, username, firstName, lastName, password, onCompleted, onError) {
    axios.post(routing + "/register", {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password
    })
    .then((response) => {
      if (onCompleted) {
        onCompleted();
      }
    })
    .catch((error) => {
      if (error.response) {
        if (onError) {
          onError("Registration Failed: " + error.response["data"]["message"]);
        }
      }
      else if (onError) {
        onError("Registration Failed");
      }
    });
  }

  Update(email, firstName, lastName, password, onCompleted, onError) {
    axios.post(routing + "/update", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    })
    .then((response) => {
      if (onCompleted) {
        onCompleted();
      }
    })
    .catch((error) => {
      if (error.response) {
        if (onError) {
          onError("Update Failed: " + error.response["data"]["message"]);
        }
      }
      else if (onError) {
        onError("Update Failed" + error);
      }
    });
  }
}

export default APIService;
