import React, { useState, useEffect, useCallback } from 'react';
import { Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import DeckInfo1 from './DeckInfo1.js';
import DeckInfo2 from './DeckInfo2.js';
import MainDeck from './MainDeck.js';
import EggDeck from './EggDeck.js';
import VisualView from './VisualView.js';
import { useParams, useHistory } from 'react-router-dom';

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

function Deck(props) {
  const [eggDeckOpen, setEggDeckOpen] = useState(true);
  const [mainDeckOpen, setMainDeckOpen] = useState(true);
  const [toRender, setToRender] = useState(false);
  const [visualView, setVisualView] = useState("none");
  const [listView, setListView] = useState("flex");
  const [deck, setDeck] = useState({
    mainDeck: [],
    mainDeckInfo: {
      colors: {},
      // costs: {},
      cardTypes: {},
      levels: {}
    },
    eggDeck: [],
    eggDeckInfo: {
      colors: {}
    }
  });
  let mParams = useParams();
  const setDisplay = props.setDisplay;
  const setPageName = props.setPageName;
  const history = useHistory();

  const getData = useCallback((mounted) => {
    setDisplay("block");
    props.service.Get("/decks/deck", {_id: mParams.id}, (data) => {
      if (mounted) {
        data["mainDeck"].sort(sortDeck());
        data["eggDeck"].sort(sortDeck());
        setDeck(data);
        setToRender(true);
        setDisplay("none");
      }
    }, (error) => {
      setDisplay("none");
      history.push('/');
    });
  }, [props.service, setDisplay, history, mParams.id]);

  useEffect(() => {
    setPageName("Decklist");
    let mounted = true;
    if (mounted) {
      if (props.params) {
        props.params["mainDeck"].sort(sortDeck());
        props.params["eggDeck"].sort(sortDeck());
        setDeck(props.params)
        setToRender(true);
      }
      else
        getData(mounted);
    }
    return () => mounted = false;
  }, [getData, props.params, setPageName]);

  return (
    <div className="d-flex flex-column flex-start container-fluid">
      <div className="d-flex row header-container justify-content-center">
        <div className="col header">
          <h1> Deck: {deck["title"]} </h1>
        </div>
      </div>
      <div className="d-flex row deck-options justify-content-start d-flex align-items-center">
        <div className="option-button-container">
          <button style={{marginRight: ".5rem"}} type="button" className="btn btn-primary" onClick={() => {
            var mainDeck = deck["mainDeck"];
            var eggDeck = deck["eggDeck"];
            var title = deck["title"];
            title = title.replace(/[/\\?%*:|"<>]/g, '-');
            // var sideDeck = props.params["sideDeck"];
            var deckString = "//Main Deck\n";
            mainDeck.forEach((card) => {
              deckString += (card["count"] + ' ' + card["cardName"] + ' (' + card["cardNo"] + ')\n');
            });
            deckString += "\n//Digi-Egg Deck\n";
            eggDeck.forEach((card) => {
              deckString += (card["count"] + ' ' + card["cardName"] + ' (' + card["cardNo"] + ')\n');
            });
            // deckString += "\n//Side Deck Deck\n";
            // eggDeck.forEach((card) => {
            //   deckString += (card["count"] + ' ' + card["cardName"] + ' ' + card["cardNo"] + '\n');
            // });


            function download(content, fileName, contentType) {
             const a = document.createElement("a");
             const file = new Blob([content], { type: contentType });
             a.href = URL.createObjectURL(file);
             a.download = fileName;
             a.click();
            }
            download(deckString, title+".txt", "text/plain");

          }}>
            Export to Untap
          </button>
        </div>
        <div className="option-button-container">
          <button style={{marginRight: ".5rem"}} type="button" className="btn btn-primary" onClick={() => {
            var params = deck;
            params["request"] = "Copy";
            props.onNavigate(params);
            history.push('/deckeditor/');
          }}>
            Copy Deck
          </button>
        </div>
        {props.userDetails.username === deck.user &&
        <>
          <div className="option-button-container">
            <button style={{marginRight: ".5rem"}} type="button" className="btn btn-primary" onClick={() => {
              var params = deck;
              params["request"] = "Edit";
              props.onNavigate(params);
              history.push('/deckeditor/');
            }}>
              Edit Deck
            </button>
          </div>
          <div className="option-button-container">
            <button style={{marginRight: ".5rem"}} type="button" className="btn btn-primary" data-toggle="modal" data-target="#deleteModal">
              Delete Deck
            </button>
            <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content bg-dark">
                  <div className="modal-header">
                    <h5 className="modal-title" id="deleteModalLabel">Delete Deck</h5>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete this deck? This cannot be reversed.
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Nevermind</button>
                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => {
                      if (deck["user"] === props.userDetails["username"]) {
                        var request = {_id: deck["id"], user: deck["user"]};
                        props.service.Post("/decks/delete", request, () => {
                          alert("Deck Deleted");
                          props.onNavigate(null);
                          history.push('/mydecks');
                        }, (e) => {
                          alert(e);
                        });
                      }
                    }}>Delete Deck</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        }
        <div className="option-button-container">
          <button style={{marginRight: ".5rem"}} type="button" className="btn btn-primary" onClick={() => {
            if (visualView === "none") {
              setVisualView("flex");
              setListView("none");
            }
            else {
              setVisualView("none");
              setListView("flex");
            }
          }}>
            {visualView === "none" && "Visual View"}
            {listView === "none" && "List View"}
          </button>
        </div>
      </div>
      <div className="deck-info-container d-flex flex-row flex-grow-1 flex-start flex-wrap justify-content-center">
        <div className="col-xl-3 col-md-4 col-sm-12 deck-info-list-container">
          {toRender && <DeckInfo1 params={deck} />}
        </div>
        <div className="row col-xl-9 col-md-8 col-sm-12 deck-info-list-container " style={{display: listView}}>
          <div className="col-xl-4 col-md-6 col-sm-12">
            <div className="deck-info-list">
              <div className="titleButton">
                <button type="button" className="btn btn-dark" onClick={() => {setMainDeckOpen(!mainDeckOpen)}}>
                  Main Deck
                </button>
              </div>
              <Collapse isOpen={mainDeckOpen}>
                <div className="mainDeck-list-container col">
                  {toRender && <MainDeck params={deck} />}
                </div>
              </Collapse>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 col-sm-12">
            <div className="deck-info-list">
              <div className="titleButton">
                <button type="button" className="btn btn-dark" onClick={() => {setEggDeckOpen(!eggDeckOpen)}}>
                  Egg Deck
                </button>
              </div>
              <Collapse isOpen={eggDeckOpen}>
                <div className="eggDeck-list-container col">
                  {toRender && <EggDeck params={deck} />}
                </div>
              </Collapse>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 col-sm-12">
            {toRender && <DeckInfo2 params={deck} />}
          </div>
        </div>
        <div className="row flex-grow-1 col-xl-9 col-md-8 col-sm-12 visualView-container flex-wrap" style={{display: visualView}}>
          {toRender && <VisualView params={deck} />}
        </div>
      </div>
    </div>
  );
}
export default Deck;
