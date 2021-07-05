import React, { useState, useEffect, useCallback } from 'react';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FilterMenu from './FilterMenu';
import Cards from './Cards';
import DeckPanel from './DeckPanel';
import { useHistory } from 'react-router-dom';

function DeckEditor(props) {
  const [cards, setCards] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const setDisplay = props.setDisplay;
  const history = useHistory();
  const setPageName = props.setPageName;
  var sessionObject = {
    mainDeck: {
      decklist :[],
      deckInfo: {
        colors: {},
        // costs: {},
        cardTypes: {},
        levels: {}
      },
      count: 0
    },
    eggDeck: {
      decklist: [],
      deckInfo: {
        colors: {}
      },
      count: 0
    },
    title: '',
    privacy: false
  };
  const [deck, setDeck] = useState(sessionObject["mainDeck"]);
  const [eggDeck, setEggDeck] = useState(sessionObject["eggDeck"]);
  const [title, setTitle] = useState(sessionObject["title"]);
  const [privacy, setPrivacy] = useState(sessionObject["privacy"]);
  var cardsInRow = 6;
  var cardsPerPage = cardsInRow * 5;
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

  function clearData() {
    var sessionObject = {
      mainDeck: {
        decklist :[],
        deckInfo: {
          colors: {},
          // costs: {},
          cardTypes: {},
          levels: {}
        },
        count: 0
      },
      eggDeck: {
        decklist: [],
        deckInfo: {
          colors: {}
        },
        count: 0
      },
      title: '',
      privacy: false
    };
    setDeck(sessionObject["mainDeck"]);
    setEggDeck(sessionObject["eggDeck"]);
    setTitle(sessionObject["title"]);
    setPrivacy(sessionObject["privacy"]);
  }

  function addCard(card) {
    // Make sure not to exceed deck limit
    console.log(card)
    if (deck["count"] < 50) {
      // Update decklist
      // Check if a copy of the card is already in the deck
      var cardIndex = deck["decklist"].findIndex(item => {
         return item.id === card["id"];
      });

      var cardColor = card["cardColor"];
      var tempDeckInfo = {...deck["deckInfo"]};
      if (cardIndex > -1) {
        // Make sure not to exceed card limit
        var tempDeck = [...deck["decklist"]];
        if (tempDeck[cardIndex]["count"] < 4) {
          // Update Deck Info
          // Update colors
          if (tempDeckInfo["colors"][cardColor]) {
            tempDeckInfo["colors"][cardColor] += 1;
          }
          else {
            tempDeckInfo["colors"][cardColor] = 1;
          }

          // Update costs
          // if (tempDeckInfo["costs"][card["playCost"]]) {
          //   if (tempDeckInfo["costs"][card["playCost"]]["colors"]) {
          //     if (tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor]) {
          //       tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor] += 1;
          //     }
          //     else {
          //       tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor] = 1;
          //     }
          //   }
          //   else {
          //     tempDeckInfo["costs"][card["playCost"]]["colors"] = {[cardColor]: 1};
          //   }
          //   tempDeckInfo["costs"][card["playCost"]]["count"] += 1;
          // }
          // else {
          //   tempDeckInfo["costs"][card["playCost"]] = {"colors": {[cardColor]: 1}, "count": 1};
          // }

          // Update cardTypes
          if (tempDeckInfo["cardTypes"][card["cardType"]]) {
            if (tempDeckInfo["cardTypes"][card["cardType"]]["colors"]) {
              if (tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor]) {
                tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor] += 1;
              }
              else {
                tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor] = 1;
              }
            }
            else {
              tempDeckInfo["cardTypes"][card["cardType"]]["colors"] = {[cardColor]: 1};
            }
            tempDeckInfo["cardTypes"][card["cardType"]]["count"] += 1;
          }
          else {
            tempDeckInfo["cardTypes"][card["cardType"]] = {"colors": {[cardColor]: 1}, "count": 1};
          }

          // Update levels
          if (tempDeckInfo["levels"][card["cardLv"]]) {
            if (tempDeckInfo["levels"][card["cardLv"]]["colors"]) {
              if (tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor]) {
                tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor] += 1;
              }
              else {
                tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor] = 1;
              }
            }
            else {
              tempDeckInfo["levels"][card["cardLv"]]["colors"] = {[cardColor]: 1};
            }
            tempDeckInfo["levels"][card["cardLv"]]["count"] += 1;
          }
          else {
            tempDeckInfo["levels"][card["cardLv"]] = {"colors": {[cardColor]: 1}, "count": 1};
          }

          tempDeck[cardIndex]["count"] = tempDeck[cardIndex]["count"] + 1;
          setDeck({decklist: tempDeck.sort(sortDeck()), deckInfo: tempDeckInfo, count: deck["count"]+1});
        }
      }
      else {
        // Update Deck Info
        // Update colors
        if (tempDeckInfo["colors"][cardColor]) {
          tempDeckInfo["colors"][cardColor] += 1;
        }
        else {
          tempDeckInfo["colors"][cardColor] = 1;
        }

        // Update costs
        // if (tempDeckInfo["costs"][card["playCost"]]) {
        //   if (tempDeckInfo["costs"][card["playCost"]]["colors"]) {
        //     if (tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor]) {
        //       tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor] += 1;
        //     }
        //     else {
        //       tempDeckInfo["costs"][card["playCost"]]["colors"][cardColor] = 1;
        //     }
        //   }
        //   else {
        //     tempDeckInfo["costs"][card["playCost"]]["colors"] = {[cardColor]: 1};
        //   }
        //   tempDeckInfo["costs"][card["playCost"]]["count"] += 1;
        // }
        // else {
        //   tempDeckInfo["costs"][card["playCost"]] = {"colors": {[cardColor]: 1}, "count": 1};
        // }

        // Update cardTypes
        if (tempDeckInfo["cardTypes"][card["cardType"]]) {
          if (tempDeckInfo["cardTypes"][card["cardType"]]["colors"]) {
            if (tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor]) {
              tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor] += 1;
            }
            else {
              tempDeckInfo["cardTypes"][card["cardType"]]["colors"][cardColor] = 1;
            }
          }
          else {
            tempDeckInfo["cardTypes"][card["cardType"]]["colors"] = {[cardColor]: 1};
          }
          tempDeckInfo["cardTypes"][card["cardType"]]["count"] += 1;
        }
        else {
          tempDeckInfo["cardTypes"][card["cardType"]] = {"colors": {[cardColor]: 1}, "count": 1};
        }

        // Update levels
        if (tempDeckInfo["levels"][card["cardLv"]]) {
          if (tempDeckInfo["levels"][card["cardLv"]]["colors"]) {
            if (tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor]) {
              tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor] += 1;
            }
            else {
              tempDeckInfo["levels"][card["cardLv"]]["colors"][cardColor] = 1;
            }
          }
          else {
            tempDeckInfo["levels"][card["cardLv"]]["colors"] = {[cardColor]: 1};
          }
          tempDeckInfo["levels"][card["cardLv"]]["count"] += 1;
        }
        else {
          tempDeckInfo["levels"][card["cardLv"]] = {"colors": {[cardColor]: 1}, "count": 1};
        }

        card["count"] = 1;
        card["id"] = card["cardNo"];
        setDeck({decklist: [...deck["decklist"], card].sort(sortDeck()), deckInfo: tempDeckInfo, count: deck["count"]+1});
      }
    }
    // console.log(deck);
  }

  function removeCard(index) {
    var card = deck["decklist"][index];

    // Update decklist
    var tempDeck = [...deck["decklist"]];
    if (index < tempDeck.length) {
      // Update deck information
      var tempDeckInfo = {...deck["deckInfo"]};
      if (tempDeckInfo["colors"][card["cardColor"]] === 1) {
        delete tempDeckInfo["colors"][card["cardColor"]];
      }
      else {
        tempDeckInfo["colors"][card["cardColor"]] -= 1;
      }

      // if (tempDeckInfo["costs"][card["playCost"]]["colors"][card["cardColor"]] === 1) {
      //   delete tempDeckInfo["costs"][card["playCost"]]["colors"][card["cardColor"]];
      // }
      // else {
      //   tempDeckInfo["costs"][card["playCost"]]["colors"][card["cardColor"]] -= 1;
      // }
      // if (tempDeckInfo["costs"][card["playCost"]]["count"] === 1) {
      //   delete tempDeckInfo["costs"][card["playCost"]];
      // }
      // else {
      //   tempDeckInfo["costs"][card["playCost"]]["count"] -= 1;
      // }

      if (tempDeckInfo["cardTypes"][card["cardType"]]["colors"][card["cardColor"]] === 1) {
        delete tempDeckInfo["cardTypes"][card["cardType"]]["colors"][card["cardColor"]];
      }
      else {
        tempDeckInfo["cardTypes"][card["cardType"]]["colors"][card["cardColor"]] -= 1;
      }
      if (tempDeckInfo["cardTypes"][card["cardType"]]["count"] === 1) {
        delete tempDeckInfo["cardTypes"][card["cardType"]];
      }
      else {
        tempDeckInfo["cardTypes"][card["cardType"]]["count"] -= 1;
      }

      if (tempDeckInfo["levels"][card["cardLv"]]["colors"][card["cardColor"]] === 1) {
        delete tempDeckInfo["levels"][card["cardLv"]]["colors"][card["cardColor"]];
      }
      else {
        tempDeckInfo["levels"][card["cardLv"]]["colors"][card["cardColor"]] -= 1;
      }
      if (tempDeckInfo["levels"][card["cardLv"]]["count"] === 1) {
        delete tempDeckInfo["levels"][card["cardLv"]];
      }
      else {
        tempDeckInfo["levels"][card["cardLv"]]["count"] -= 1;
      }

      // Check if card is last copy
      if (tempDeck[index]["count"] > 1) {
        tempDeck[index]["count"] = tempDeck[index]["count"] - 1;
      }
      else {
        tempDeck.splice(index, 1);
      }
      setDeck({decklist: tempDeck.sort(sortDeck()), deckInfo: tempDeckInfo, count: deck["count"]-1});
    }
    // console.log(deck);
  }

  function addEggCard(card) {
    // Make sure not to exceed deck limit
    if (eggDeck["count"] < 5) {

      // Update decklist
      // Check if a copy of the card is already in the deck
      var cardIndex = eggDeck["decklist"].findIndex(item => {
         return item.id === card["id"];
      });
      var tempDeckInfo = {...eggDeck["deckInfo"]};
      // console.log(tempDeckInfo);
      if (cardIndex > -1) {
        // Update deck information
        if (tempDeckInfo["colors"][card["cardColor"]]) {
          tempDeckInfo["colors"][card["cardColor"]] += 1;
        }
        else {
          tempDeckInfo["colors"][card["cardColor"]] = 1;
        }
        var tempDeck = [...eggDeck["decklist"]];
        if (tempDeck[cardIndex]["count"] < 4) {
          tempDeck[cardIndex]["count"] = tempDeck[cardIndex]["count"] + 1;
          setEggDeck({decklist: tempDeck.sort(sortDeck()), deckInfo: tempDeckInfo, count: eggDeck["count"]+1});
        }
      }
      else {
        // Update deck information
        if (tempDeckInfo["colors"][card["cardColor"]]) {
          tempDeckInfo["colors"][card["cardColor"]] += 1;
        }
        else {
          tempDeckInfo["colors"][card["cardColor"]] = 1;
        }
        card["count"] = 1;
        card["id"] = card["cardNo"];
        setEggDeck({decklist: [...eggDeck["decklist"], card].sort(sortDeck()), deckInfo: tempDeckInfo, count: eggDeck["count"]+1});
      }
    }
    // console.log(eggDeck);
  }

  function removeEggCard(index) {
    var card = eggDeck["decklist"][index];

    // Update decklist
    var tempDeck = [...eggDeck["decklist"]];
    if (index < tempDeck.length) {
      // Update deck information
      var tempDeckInfo = {...eggDeck["deckInfo"]};
      if (tempDeckInfo["colors"][card["cardColor"]] === 1) {
        delete tempDeckInfo["colors"][card["cardColor"]];
      }
      else {
        tempDeckInfo["colors"][card["cardColor"]] -= 1;
      }
      // Check if card is last copy
      if (tempDeck[index]["count"] > 1) {
        tempDeck[index]["count"] = tempDeck[index]["count"] - 1;
      }
      else {
        tempDeck.splice(index, 1);
      }
      setEggDeck({decklist: tempDeck.sort(sortDeck()), deckInfo: tempDeckInfo, count: eggDeck["count"]-1});
    }

    // console.log(eggDeck);
  }

  function sortDeck() {

    return function (a, b) {
      if (a["cardColor"] > b["cardColor"]) {
        return 1;
      }
      else if (a["cardColor"] < b["cardColor"]) {
        return -1;
      }
      else {
        if (a["cardType"] > b["cardType"]) {
          return 1;
        }
        else if (a["cardType"] < b["cardType"]) {
          return -1;
        }
        else {
          if (a["cardLv"] > b["cardLv"]) {
            return 1;
          }
          else if (a["cardLv"] < b["cardLv"]) {
            return -1;
          }
          else {
            if (a["cardName"] > b["cardName"]) {
              return 1;
            }
            else if (a["cardName"] < b["cardName"]) {
              return -1;
            }
            else {
              if (a["cardNo"] > b["cardNo"]) {
                return 1;
              }
              else if (a["cardNo"] < b["cardNo"]) {
                return -1;
              }
              return 0;
            }
          }
        }
      }
    }
  }

  const getData = useCallback((mounted) => {
    var currentDate = Date.now();
    var sessionObject = {
      mainDeck: {
        decklist: props.params["mainDeck"],
        deckInfo: props.params["mainDeckInfo"],
        count: props.params["mainDeckCount"]
      },
      eggDeck: {
        decklist: props.params["eggDeck"],
        deckInfo: props.params["eggDeckInfo"],
        count: props.params["eggDeckCount"]
      },
      title: props.params["title"],
      privacy: props.params["privacy"]
    };
    setDeck(sessionObject["mainDeck"]);
    setEggDeck(sessionObject["eggDeck"]);
    setTitle(sessionObject["title"]);
    setPrivacy(sessionObject["privacy"]);
    console.log(props.params);
    // console.log("Session Storage: " + sessionStorage.getItem('cardData'));
    // console.log("Current Date: " + currentDate);
    if (sessionStorage.getItem('cardData') == null) {
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
        }
      }, (error) => {
        setDisplay("none");
        history.push('/');
        console.log(error);
      });
    }
    else if (currentDate - JSON.parse(sessionStorage.getItem('cardData'))['created'] >= 43200000) {
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
        }
      }, (error) => {
        setDisplay("none");
        history.push('/');
        console.log(error);
      });
    }
    else {
      if (mounted) {
        var cards = JSON.parse(sessionStorage.getItem("cardData"))["data"];
        setCards(cards.sort(sortCards()));
        setPages(Math.ceil(cards.length/cardsPerPage));
        setDisplay("none");
      }
    }
  }, [props.service, cardsPerPage, setDisplay, history, props.params]);

  useEffect(() => {
    setPageName("Deck Builder");
    let mounted = true;
    if (mounted && props.params)
      getData(mounted);
    else
      history.push('/');

    return () => mounted = false;
  },[getData, history, props.params, setPageName]);

  return (
    <div className="container-fluid d-flex flex-row flex-wrap flex-start">
      <div className="flex-column col-lg-4 col-md-4 col-sm-12 deck-list">
        <DeckPanel {...props} clearData={clearData} setCards={setCards} setPages={setPages} setPage={setPage} cardsInRow={cardsInRow} cardsPerPage={cardsPerPage} rowsPerPage={rowsPerPage} addCard={addCard} removeCard={removeCard} deck={deck} setDeck={setDeck} addEggCard={addEggCard} removeEggCard={removeEggCard} eggDeck={eggDeck} setEggDeck={setEggDeck} title={title} setTitle={setTitle} privacy={privacy} setPrivacy={setPrivacy}/>
      </div>
      <div className="d-flex flex-column col-lg-8 col-md-8 col-sm-12 db-cards-filter-container">
        <div className="filterWrapper-top row d-flex">
          <FilterMenu sortCards={sortCards} service={props.service} setCards={setCards} setPages={setPages} setPage={setPage} cardsInRow={cardsInRow} cardsPerPage={cardsPerPage} rowsPerPage={rowsPerPage}/>
        </div>
        <div className="d-flex flex-column flex-grow-1 cardsWrapper">
          <Cards service={props.service} cards={cards} pages={pages} page={page} setPage={setPage} cardsInRow={cardsInRow} cardsPerPage={cardsPerPage} rowsPerPage={rowsPerPage} addCard={addCard}  addEggCard={addEggCard}/>
        </div>
      </div>
    </div>
  );
}
export default DeckEditor;
