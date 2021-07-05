import React, {useState} from 'react';
import { UncontrolledPopover, PopoverHeader, PopoverBody, Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import cardBack from '../../assets/card-back.jpg';

function VisualView(props) {
  const [eggDeckOpen, setEggDeckOpen] = useState(true);
  const [mainDeckOpen, setMainDeckOpen] = useState(true);
  const [mainSecondary, setMainSecondary] = useState("flex");
  const [eggSecondary, setEggSecondary] = useState("flex");
  let mainDecklist = {};
  props.params["mainDeck"].forEach((card) => {
    if (mainDecklist[card["cardLv"]]) {
      mainDecklist[card["cardLv"]].push(card);
    }
    else {
      mainDecklist[card["cardLv"]] = [card];
    }
  });

  var keys = Object.keys(mainDecklist);
  var keysLookup = Object.keys(mainDecklist);
  var index = keys.findIndex((temp) => temp === '-');
  if (index > -1) {
    keysLookup.splice(index, 1);
    keysLookup.unshift('-');
  }

  var deckArr = [];
  for (var i=0; i<keys.length; i++){
    for (var j=0; j<mainDecklist[keys[i]].length; j++){
      deckArr.push(mainDecklist[keys[i]][j]);
    }
  }

  // Iterate through dictionary keys. If key is '-' then do last

  let mainDeck = deckArr.map((card) => {
    return (
      <div className="card-container col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12" key={card["cardNo"]}>
        <div className="card text-white bg-dark text-left">
          <a href="/#" id={card['cardNo'] + "link"} onClick={(e) => {e.preventDefault();}}>
            <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
            <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
          </a>
          <UncontrolledPopover delay={{"show": 350}} className={"card-builder-popover"} boundariesElement="body" placement="auto" trigger="hover" target={card['cardNo'] + "link"}>
            <PopoverHeader className="text-white bg-dark">{card['cardNo'] + ' ' + card['cardName']}</PopoverHeader>
            <PopoverBody className="text-white bg-dark">
              <div className="card bg-dark text-white text-left" key={card["cardNo"]}>
                <div className="row no-gutters">
                  <div className="col">
                    <div className="popover-card-body-image">
                      <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
                      <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
                    </div>
                  </div>
                  <div className="col">
                    <div className="popover-card-body-text">
                      <p className="card-text">{"Card Color: " + card['cardColor']}</p>
                      <p className="card-text">{"Card Type: " + card['cardType']}</p>
                      <p className="card-text">{"Card Rarity: " + card['cardRarity']}</p>
                      <p className="card-text">{"Effect: " + card['effect']}</p>
                      <p className="card-text">{"Inherited Effect: " + card['digivolveEffect']}</p>
                      <p className="card-text">{"Security Effect: " + card['securityEffect']}</p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverBody>
          </UncontrolledPopover>
        </div>
      </div>
    );
  });

  let eggDeck = props.params["eggDeck"].map((card) => {
    return (
      <div className="card-container col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12" key={card["cardNo"]}>
        <div className="card text-white bg-dark text-left">
          <a href="/#" id={card['cardNo'] + "link"} onClick={(e) => {e.preventDefault();}}>
            <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
            <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
          </a>
          <UncontrolledPopover delay={{"show": 350}} className={"card-builder-popover"} boundariesElement="body" placement="auto" trigger="hover" target={card['cardNo'] + "link"}>
            <PopoverHeader className="text-white bg-dark">{card['cardNo'] + ' ' + card['cardName']}</PopoverHeader>
            <PopoverBody className="text-white bg-dark">
              <div className="card bg-dark text-white text-left" key={card["cardNo"]}>
                <div className="row no-gutters">
                  <div className="col">
                    <div className="popover-card-body-image">
                      <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
                      <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
                    </div>
                  </div>
                  <div className="col">
                    <div className="popover-card-body-text">
                      <p className="card-text">{"Card Color: " + card['cardColor']}</p>
                      <p className="card-text">{"Card Type: " + card['cardType']}</p>
                      <p className="card-text">{"Card Rarity: " + card['cardRarity']}</p>
                      <p className="card-text">{"Effect: " + card['effect']}</p>
                      <p className="card-text">{"Inherited Effect: " + card['digivolveEffect']}</p>
                      <p className="card-text">{"Security Effect: " + card['securityEffect']}</p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverBody>
          </UncontrolledPopover>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="d-flex flex-column flex-grow-1 col-12 col-xl-8 col-lg-8 col-md-8 col-sm-12 visualView-container-decks deck-info-list-container" >
        <div className="d-flex flex-column flex-grow-1 deck-info-list">
          <div className="titleButton">
            <button type="button" className="btn btn-dark" onClick={() => {setMainDeckOpen(!mainDeckOpen);
              if (mainSecondary === "none") {
                setMainSecondary("flex");
              }
              else {
                setMainSecondary("none");
              }}}>
              Main Deck
            </button>
          </div>
          <Collapse className="flex-row flex-wrap card-list-container" isOpen={mainDeckOpen} style={{overflowY:"auto", overflowX:"hidden", display: mainSecondary}} >
            {mainDeck}
          </Collapse>
        </div>
      </div>
      <div className="d-flex flex-column flex-grow-1 col-12 col-xl-4 col-lg-4 col-md-4 col-sm-12 visualView-container-decks deck-info-list-container">
        <div className="d-flex flex-column flex-grow-1 deck-info-list">
          <div className="titleButton">
            <button type="button" className="btn btn-dark" onClick={() => {setEggDeckOpen(!eggDeckOpen);
              if (eggSecondary === "none") {
                setEggSecondary("flex");
              }
              else {
                setEggSecondary("none");
              }}}>
              Egg Deck
            </button>
          </div>
          <Collapse className="flex-row flex-wrap card-list-container" isOpen={eggDeckOpen} style={{overflowY:"auto", overflowX:"hidden", display: eggSecondary}}>
            {eggDeck}
          </Collapse>
        </div>
      </div>
    </>
  );
}

export default VisualView;
