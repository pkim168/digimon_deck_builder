import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import spinner from './assets/spinner.png';
import AdminPanel from './component/Admin/AdminPanel.js';
import CardDB from './component/CardDB/CardDB.js';
import Deck from './component/Decks/Deck.js';
import DeckBuilder from './component/DeckBuilder/DeckBuilder.js';
import DeckDB from './component/DeckDB/DeckDB.js';
import DeckEditor from './component/DeckEditor/DeckEditor.js';
import Home from './component/Home/Home.js';
import MyDecks from './component/MyDecks/MyDecks.js';
import TopNavbar from './component/Navbar/Navbar.js';
import Password from './component/Account/Password.js';
import Resend from './component/Account/Resend.js';
import Reset from './component/Account/Reset.js';
import Settings from './component/Account/Settings.js';
import Confirmation from './component/Account/Confirmation.js';
import { Route, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function App(props) {

  const history = useHistory();
  const [userDetails, setUserDetails] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [rightNav, setRightNav] = useState([]);
  const [params, setParams] = useState();
  const [display, setDisplay] = useState("block");
  const [pageName, setPageName] = useState("Home");

  const onNavigate = useCallback((params) => {
    setParams(params);
  }, []);

  const onLoginChange = useCallback(() => {
    if (!props.service.Authorized) {
      setUserDetails({});
      setAdmin(false);
      setRightNav(["Login/Register"]);
      setLoaded(true);
    } else {
      props.service.Get("/users/me", {}, (data) => {
        setRightNav(["User Panel"]);
        if (data[0]["role"] === "admin") {
          setAdmin(true);
        }
        setUserDetails(data[0]);
        setLoaded(true);
      }, (error) => {
        props.service.Logout( () => {
          history.push('/');
          onNavigate(null);
        }, (e) => {
          alert(e);
        });
        setUserDetails({});
        setAdmin(false)
        setRightNav(["Login/Register"])
        setLoaded(false);
      });
    }
  }, [props.service, onNavigate, history]);

  useEffect(() => {
    onLoginChange();
  },[onLoginChange]);


  return (
    <div className="App">
      <div id="navigation-wrapper">
        <TopNavbar pageName={pageName} onNavigate={onNavigate} rightNav={rightNav} service={props.service} admin={admin} onLoginChange={onLoginChange} userDetails={userDetails}/>
      </div>
      <div style={{display: display}}>
        <div className="loader d-flex align-items-center justify-content-center" style={{display: display}}>
          <img className="loader-spinner" src={spinner} alt="Loading" style={{display: display}}/>
          <div className="loader-background" style={{display: display}}></div>
        </div>
      </div>
      <div id="component-wrapper">
        <Switch>
          <Route path="/" exact={true} render={() => <Home service={props.service} setDisplay={setDisplay} setPageName={setPageName} onNavigate={onNavigate}/>}/>
          <Route path="/admin" render={() => <AdminPanel service={props.service} setDisplay={setDisplay} userDetails={userDetails} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="/mydecks" render={() => <MyDecks service={props.service} userDetails={userDetails} onNavigate={onNavigate} setDisplay={setDisplay} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="/carddb" render={() => <CardDB service={props.service} setDisplay={setDisplay} setPageName={setPageName} />}/>
          <Route path="/confirmation/:token" render={({match}) => <Confirmation service={props.service} setDisplay={setDisplay} onNavigate={onNavigate} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="/confirmation" render={() => <Redirect to="/" />} />
          <Route path="/deckbuilder" render={() => <DeckBuilder service={props.service} userDetails={userDetails} onNavigate={onNavigate} params={params} setDisplay={setDisplay} loaded={loaded} setPageName={setPageName}/> }/>
          <Route path="/deckeditor" render={({match}) => <DeckEditor service={props.service} userDetails={userDetails} onNavigate={onNavigate} params={params} setDisplay={setDisplay} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="/deckeditor" render={() => <Redirect to="/" />} />
          <Route path="/deckdb" render={() => <DeckDB service={props.service}  onNavigate={onNavigate} setDisplay={setDisplay} setPageName={setPageName}/>}/>
          <Route path="/decklist/:id" render={({match}) => <Deck service={props.service} params={params} onNavigate={onNavigate} userDetails={userDetails} setDisplay={setDisplay} setPageName={setPageName}/>}/>
          <Route path="/decklist" render={() => <Redirect to="/deckdb" />} />
          <Route path="/password" render={() => <Password service={props.service}  setDisplay={setDisplay} onNavigate={onNavigate} setPageName={setPageName}/>}/>
          <Route path="/resend" render={() => <Resend service={props.service} setDisplay={setDisplay} onNavigate={onNavigate} setPageName={setPageName} />}/>
          <Route path="/reset/:token" render={({match}) => <Reset service={props.service} setDisplay={setDisplay} onNavigate={onNavigate} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="/reset" render={() => <Redirect to="/" />} />
          <Route path="/settings" render={() => <Settings service={props.service} userDetails={userDetails} setDisplay={setDisplay} onNavigate={onNavigate} onLoginChange={onLoginChange} loaded={loaded} setPageName={setPageName}/>}/>
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
