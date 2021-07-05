import React, { useState, useEffect, useCallback } from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FilterMenu from './FilterMenu';
import Decks from './Decks';

function DeckDB(props) {
  const [decks, setDecks] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  var decksInRow = 1;
  var decksPerPage = decksInRow * 5;
  var rowsPerPage = Math.floor(decksPerPage/decksInRow);
  const setDisplay = props.setDisplay;
  const setPageName = props.setPageName;

  const getData = useCallback((mounted) => {
    // console.log("Session Storage: " + sessionStorage.getItem('deckData'));
    // console.log("Current Date: " + currentDate);
    setDisplay("block");
    props.service.Get("/decks/deckdb", {}, (data) => {
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
        setPages(Math.ceil(decks.length/decksPerPage));
        setDisplay("none");
      }
    }, (error) => {
      setDisplay("none");
      console.log(error);
    });
  }, [props.service, decksPerPage, setDisplay]);

  useEffect(() => {
    setPageName("Deck Database");
    let mounted = true;
    if (mounted)
      getData(mounted);

    return () => mounted = false;
  },[getData, setPageName]);

  return (
    <div className="container-fluid d-flex flex-row flex-wrap flex-start">
      <div className="filterMenuWrapper col-xl-4 col-lg-6 col-md-12 col-sm-12">
        <FilterMenu service={props.service} setDecks={setDecks} setPages={setPages} setPage={setPage} decksInRow={decksInRow} decksPerPage={decksPerPage} rowsPerPage={rowsPerPage}/>
      </div>
      <div className="decksWrapper flex-grow-1 d-flex flex-column col-xl-8 col-lg-6 col-md-12 col-sm-12">
        <Decks {...props} decks={decks} pages={pages} page={page} setPage={setPage} decksInRow={decksInRow} decksPerPage={decksPerPage} rowsPerPage={rowsPerPage}/>
      </div>
    </div>
  );
}
export default DeckDB;
