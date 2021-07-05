import React, { useState, useEffect, useCallback } from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FilterMenu from './FilterMenu';
import Cards from './Cards';

function CardDB(props) {
  const [cards, setCards] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const setDisplay = props.setDisplay;
  const setPageName = props.setPageName;
  var cardsInRow = 3;
  var cardsPerPage = cardsInRow * 4;
  var rowsPerPage = Math.floor(cardsPerPage/cardsInRow);

  function sortCards() {

    return function (a, b) {
      if (a["cardNo"] > b["cardNo"]) {
        return 1;
      }
      else{
        return -1;
      }
    }
  }

  const getData = useCallback((mounted) => {
    var currentDate = Date.now();
    // console.log("Session Storage: " + sessionStorage.getItem('cardData'));
    // console.log("Current Date: " + currentDate);
    if (sessionStorage.getItem('cardData') == null) {
      // console.log("Session Storage doesn't exist.");
      props.service.Get("/cards/", {}, (data) => {
        // put data into local storage
        if (mounted) {
          var created = Date.now();
          var sessionObject = {
              created: created,
              data: data
          }
          sessionStorage.setItem('cardData', JSON.stringify(sessionObject));
          var cards = JSON.parse(sessionStorage.getItem("cardData"))["data"];
          setCards(cards.sort(sortCards()));
          setPages(Math.ceil(cards.length/cardsPerPage));
          setDisplay("none");
          // console.log(cards);
        }
      }, (error) => {
        setDisplay("none");
        console.log(error);
      });
    }
    else if (currentDate - JSON.parse(sessionStorage.getItem('cardData'))['created'] >= 43200000) {
      // console.log("Created At: " + JSON.parse(sessionStorage.getItem('cardData'))['created']);
      props.service.Get("/cards/", {}, (data) => {
        // put data into local storage
        if (mounted) {
          var created = Date.now();
          var sessionObject = {
              created: created,
              data: data
          }
          sessionStorage.setItem('cardData', JSON.stringify(sessionObject));
          var cards = JSON.parse(sessionStorage.getItem("cardData"))["data"];
          setCards(cards);
          setPages(Math.ceil(cards.length/cardsPerPage));
          setDisplay("none");
          // console.log(cards);
        }
      }, (error) => {
        setDisplay("none");
        console.log(error);
      });
    }
    else {
      if (mounted) {
        var cards = JSON.parse(sessionStorage.getItem("cardData"))["data"];
        setCards(cards);
        setPages(Math.ceil(cards.length/cardsPerPage));
        setDisplay("none");
        // console.log(cards);
      }
    }
  }, [props.service, cardsPerPage, setDisplay]);

  useEffect(() => {
    setPageName("Card Database");
    let mounted = true;
    if (mounted)
      getData(mounted);

    return () => mounted = false;
  },[getData, setPageName]);

  return (
    <div className="container-fluid d-flex flex-column flex-start">
      <div className="filterWrapper-top flex-row">
        <FilterMenu sortCards={sortCards} service={props.service} setCards={setCards} setPages={setPages} setPage={setPage} cardsInRow={cardsInRow} cardsPerPage={cardsPerPage} rowsPerPage={rowsPerPage}/>
      </div>
      <div className="cardsWrapper flex-grow-1 d-flex flex-column">
        <Cards service={props.service} cards={cards} pages={pages} page={page} setPage={setPage} cardsInRow={cardsInRow} cardsPerPage={cardsPerPage} rowsPerPage={rowsPerPage}/>
      </div>
    </div>
  );
}
export default CardDB;
