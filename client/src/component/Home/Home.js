import React, { useEffect, useCallback, useState } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FacebookProvider, Page } from 'react-facebook';
import { Card, CardTitle } from 'reactstrap';
import Decks from './Decks.js';
// import Youtube from './Youtube.js';

function Home(props) {
  const setDisplay = props.setDisplay;
  const setPageName = props.setPageName;
  const [decks, setDecks] = useState([]);
  var decksInRow = 1;
  var decksPerPage = decksInRow * 5;
  var rowsPerPage = Math.floor(decksPerPage/decksInRow);

  const getData = useCallback((mounted) => {
    // console.log("Session Storage: " + sessionStorage.getItem('deckData'));
    // console.log("Current Date: " + currentDate);
    setDisplay("block");
    props.service.Get("/decks/deckdb/", {limit: 5}, (data) => {
      // put data into local storage
      if (mounted) {
        var created = Date.now();
        var sessionObject = {
            created: created,
            data: data
        }
        sessionStorage.setItem('deckData', JSON.stringify(sessionObject));
        var decks = JSON.parse(sessionStorage.getItem("deckData"))["data"];
        setDecks(decks);
        setDisplay("none");
      }
    }, (error) => {
      setDisplay("none");
      console.log(error);
    });
  }, [props.service, setDisplay]);

  useEffect(() => {
    setPageName("Home");
    let mounted = true;
    if (mounted)
      getData(mounted);

    return () => mounted = false;
  },[getData, setPageName]);

  return (
    <div className="container-fluid">
      <div className="home-content row d-flex">
        <div className="home-card-container col-auto">
          <Card body className="home-card text-white bg-1">
            <FacebookProvider appId="1426479930889397">
              <Page href="https://www.facebook.com/digimontcgen" width="350" tabs="timeline" smallHeader="true"/>
            </FacebookProvider>
          </Card>
        </div>
        <div className="home-card-container col">
          <Card body className="home-card text-white bg-1">
            <CardTitle><h2>Recent Decks</h2></CardTitle>
            <Decks {...props} decks={decks} decksInRow={decksInRow} decksPerPage={decksPerPage} rowsPerPage={rowsPerPage}/>
          </Card>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="container-fluid">
  //     <div className="row header-container justify-content-center">
  //     </div>
  //     <div className="row d-flex">
  //       <div className="home-card-container col">
  //         <div className="row card-container">
  //           <Card body className="home-card text-white bg-1">
  //             <FacebookProvider appId="1426479930889397">
  //               <Page href="https://www.facebook.com/digimontcgen" width="300px" tabs="timeline" />
  //             </FacebookProvider>
  //           </Card>
  //         </div>
  //         <div className="row card-container">
  //           <Card body className="home-card text-white bg-1">
  //             <CardTitle><h2>Recent Decks</h2></CardTitle>
  //             <Decks {...props} decks={decks} decksInRow={decksInRow} decksPerPage={decksPerPage} rowsPerPage={rowsPerPage}/>
  //           </Card>
  //         </div>
  //       </div>
  //       <div className="home-card-container card-container col">
  //         <Card body className="home-card text-white bg-1">
  //           <CardTitle><h2>Recent Content</h2></CardTitle>
  //           <Youtube {...props}/>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // );
}
export default Home;
