import React, {useState, } from 'react';
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, UncontrolledPopover, PopoverHeader, PopoverBody, Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import cardBack from '../../assets/card-back.jpg';
import { useHistory } from "react-router-dom";

function EggDeck(props) {

  function removeEggCard(i){
    props.removeEggCard(i);
  }

  function addEggCard(card){
    props.addEggCard(card);
  }

  function getColorValue(color) {
    switch (color) {
      case "Black":
        return ["Black", "White"];

      case "Blue":
        return 	["#0097f4", "White"];

      case "Green":
        return ["#009c6b", "White"];

      case "Purple":
        return ["#6456a3", "White"];

      case "Red":
        return ["#e6002c", "White"];

      case "White":
        return ["White", "Black"];

      case "Yellow":
        return 	["#ffff00", "Black"];

      default:
        return ["White", "Black"];
    }
  }

  console.log(props.deck);
  console.log(props.eggDeck);
  var result = props.eggDeck["decklist"].map((card, i) => {
    var [backgroundColor, textColor] = getColorValue(card["cardColor"]);
    return (
      <FormGroup className="deck-row" key={card["cardNo"] + card["cardName"] + "row"} row>
        <InputGroup>
          <Input value={card["cardNo"] + " " + card["cardName"]} id={card["cardNo"] + "row"} style={{backgroundColor: backgroundColor, color: textColor}} disabled/>
          <UncontrolledPopover delay={{"show": 250}} className={"card-builder-popover"} boundariesElement="body" placement="auto" trigger="hover" target={card["cardNo"] + "row"}>
            <PopoverHeader className="bg-dark text-white">{card['cardNo'] + ' ' + card['cardName']}</PopoverHeader>
            <PopoverBody className="bg-dark text-white">
              <div className="card bg-dark text-white text-left" key={card["cardNo"] + "row"}>
                <div className="row no-gutters">
                  <div className="col-md-5">
                    <div className="popover-card-body-image">
                      <a href="/#" id={card['cardNo'] + "link"} onClick={(e) => {e.preventDefault();}}>
                        <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
                        <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
                      </a>
                    </div>
                  </div>
                  <div className="col-md-7">
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
          <InputGroupAddon addonType="append">
            <button className="btn btn-danger" onClick={() => {removeEggCard(i); console.log(props.eggDeck)}}>
              -
            </button>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <InputGroupText className="bg-dark text-white"> {card["count"]} </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <button className="btn btn-success" onClick={() => {addEggCard(card); console.log(props.eggDeck)}}>
              +
            </button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    )
  });
  return result;
}

function Deck(props) {

  function removeCard(i){
    props.removeCard(i);
  }

  function addCard(card){
    props.addCard(card);
  }

  function getColorValue(color) {
    switch (color) {
      case "Black":
        return ["Black", "White"];

      case "Blue":
        return 	["#0097f4", "White"];

      case "Green":
        return ["#009c6b", "White"];

      case "Purple":
        return ["#6456a3", "White"];

      case "Red":
        return ["#e6002c", "White"];

      case "White":
        return ["White", "Black"];

      case "Yellow":
        return 	["#ffff00", "Black"];

      default:
        return ["White", "Black"];
    }
  }

  var result = props.deck["decklist"].map((card, i) => {
    var [backgroundColor, textColor] = getColorValue(card["cardColor"]);
    return (
      <FormGroup className="deck-row" key={card["cardNo"] + card["cardName"]} row>
        <InputGroup>
          <Input value={card["cardNo"] + " " + card["cardName"]} id={card["cardNo"] + "row"} style={{backgroundColor: backgroundColor, color: textColor}} disabled/>
          <UncontrolledPopover delay={{"show": 250}} className="card-builder-popover" boundariesElement="body" placement="auto" trigger="hover" target={card["cardNo"] + "row"}>
            <PopoverHeader className="bg-dark text-white">{card['cardNo'] + ' ' + card['cardName']}</PopoverHeader>
            <PopoverBody className="bg-dark text-white">
              <div className="card bg-dark text-white text-left" key={card["cardNo"]}>
                <div className="row no-gutters">
                  <div className="col-md-5">
                    <div className="popover-card-body-image">
                      <a href="/#" id={card['cardNo'] + "link"} onClick={(e) => {e.preventDefault();}}>
                        <img src={card["src"]} className="card-img" alt="..."/>
                      </a>
                    </div>
                  </div>
                  <div className="col-md-7">
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
          <InputGroupAddon addonType="append">
            <button className="btn btn-danger" onClick={() => {removeCard(i); console.log(props.deck)}}>
              -
            </button>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <InputGroupText className="bg-dark text-white"> {card["count"]} </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <button className="btn btn-success" onClick={() => {console.log(card); addCard(card); console.log(props.deck)}}>
              +
            </button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    )
  });
  return result;
}

function DeckPanel(props) {
  const [infoOpen, setInfoOpen] = useState(true);
  const [mainOpen, setMainOpen] = useState(true);
  const [eggOpen, setEggOpen] = useState(true);
  const history = useHistory();

  // useEffect(() => {
  //
  //   getDeck(props);
  // },[getDeck]);

  // function sortForms() {
  //   return function (a, b) {
  //     var forms = {"Rookie": 1, "Champion": 2, "Ultimate": 3, "Mega": 4, "-": 5};
  //     // console.log(forms[a] + " | " + forms[b]);
  //     if (forms[a] > forms[b]) {
  //       return 1;
  //     }
  //     else if (forms[a] < forms[b]) {
  //       return -1;
  //     }
  //     return 0;
  //   }
  // }

  return (
    <div className="deckMenu">
      <Form className="deckPanel" id="deckPanel"  onSubmit={(e) => {
        e.preventDefault();
      }}>
        <div className="deckInfo">
          <div className="titleButton">
            <button type="button" className="btn btn-dark" onClick={() => {setInfoOpen(!infoOpen)}}>
              Deck Info
            </button>
          </div>
          <Collapse isOpen={infoOpen}>
            <div className="deck-info-container col">
              <FormGroup row style={{margin:0}}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Deck Title </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" id="deckTitle" value={props.title} onChange={(e) => {
                    props.setTitle(e.target.value);
                  }}/>
                </InputGroup>
                <InputGroup>
                  <Input className="bg-dark text-white" value="Private" id="private" disabled/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="bg-dark text-white">
                      <Input className="bg-dark text-white" addon type="checkbox" id="privacy" checked={props.privacy} onChange={(e) => {
                        props.setPrivacy(e.target.checked);
                      }}/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
          </Collapse>
        </div>
        <div className="mainDeck">
          <div className="titleButton">
            <button type="button" className="btn btn-dark" onClick={() => {setMainOpen(!mainOpen)}}>
              Main Deck: {props.deck["count"]}
            </button>
          </div>
          <Collapse isOpen={mainOpen}>
            <div className="deck-list-container col">
              <Deck {...props} />
            </div>
          </Collapse>
        </div>
        <div className="digiEggDeck">
          <div className="titleButton">
            <button type="button" className="btn btn-dark" onClick={() => {setEggOpen(!eggOpen)}}>
              Digi-Egg Deck: {props.eggDeck["count"]}
            </button>
          </div>
          <Collapse isOpen={eggOpen}>
            <div className="egg-deck-list-container col">
              <EggDeck {...props} />
            </div>
          </Collapse>
        </div>
        <div className="deckPanel-buttons col">
          <FormGroup row>
            <div className="btn-group-vertical w-100">
              <div className="col btn-group">
                <button type="button" className="btn w-50 btn-danger" onClick={()=> {
                  props.clearData();
                  props.setDeck({decklist :[], deckInfo: {colors: {}, cardTypes: {}, levels: {}}, count: 0});
                  // props.setDeck({decklist :[], deckInfo: {colors: {}, costs: {}, cardTypes: {}, levels: {}}, count: 0});
                  props.setEggDeck({decklist :[], deckInfo: {colors: {}}, count: 0});
                }}>
                  Clear
                </button>
                <button type="button" className="btn w-50 btn-warning" onClick={() => {
                  if (props.deck["count"] === 0 && props.eggDeck["count"] === 0) {
                    alert("Please add a card first");
                    return;
                  }
                  var deckTitle = document.getElementById("deckTitle").value.trim();
                  var privacy = document.getElementById("privacy").checked;
                  var deckInfo = props.deck["deckInfo"];
                  var eggDeckInfo = props.eggDeck["deckInfo"];
                  var cardTypes = {};
                  var colors = {};
                  // var costs = {};
                  var levels = {};
                  var eggColors = {};

                  var mainDeck = [];
                  for (var i=0; i < props.deck["decklist"].length; i++) {
                    mainDeck.push({id: props.deck["decklist"][i]["id"], count: props.deck["decklist"][i]["count"]});
                  }

                  var eggDeck = [];
                  for (var j=0; j < props.eggDeck["decklist"].length; j++) {
                    eggDeck.push({id: props.eggDeck["decklist"][j]["id"], count: props.eggDeck["decklist"][j]["count"]});
                  }


                  Object.keys(deckInfo["cardTypes"]).sort().forEach(function(key) {
                    var temp = {};
                    var count = deckInfo["cardTypes"][key]["count"];
                    Object.keys(deckInfo["cardTypes"][key]["colors"]).sort().forEach(function(color) {
                      temp[color] = deckInfo["cardTypes"][key]["colors"][color];
                    });
                    cardTypes[key] = {colors: temp, count: count};
                  });

                  Object.keys(deckInfo["colors"]).sort().forEach(function(key) {
                    colors[key] = deckInfo["colors"][key];
                  });

                  // Object.keys(deckInfo["costs"]).sort().forEach(function(key) {
                  //   var temp = {};
                  //   var count = deckInfo["costs"][key]["count"];
                  //   Object.keys(deckInfo["costs"][key]["colors"]).sort().forEach(function(color) {
                  //     temp[color] = deckInfo["costs"][key]["colors"][color];
                  //   });
                  //   costs[key] = {colors: temp, count: count};
                  // });

                  Object.keys(deckInfo["levels"]).sort().forEach(function(key) {
                    var temp = {};
                    var count = deckInfo["levels"][key]["count"];
                    Object.keys(deckInfo["levels"][key]["colors"]).sort().forEach(function(color) {
                      temp[color] = deckInfo["levels"][key]["colors"][color];
                    });
                    levels[key] = {colors: temp, count: count};
                  });

                  Object.keys(eggDeckInfo["colors"]).sort().forEach(function(key) {
                    eggColors[key] = eggDeckInfo["colors"][key];
                  });

                  deckInfo["cardTypes"] = cardTypes;
                  // deckInfo["costs"] = costs;
                  deckInfo["colors"] = colors;
                  deckInfo["levels"] = levels;
                  eggDeckInfo["colors"] = eggColors;
                  var request = {};
                  if (props.userDetails["username"] === props.params["user"] && props.params["request"] === "Edit") {
                    request = {_id: props.params["id"], mainDeck: props.deck["decklist"], mainDeckInfo: deckInfo, mainDeckCount: props.deck["count"], eggDeck: props.eggDeck["decklist"], eggDeckInfo: eggDeckInfo, eggDeckCount: props.eggDeck["count"], status: "Incomplete", title: deckTitle, privacy: privacy, user: props.userDetails["username"], creation: props.params["creation"]};
                    // console.log(request);
                    props.service.Post("/decks/update", request, () => {
                      alert("Deck Saved");
                      props.clearData();
                      history.push('/mydecks');
                      props.onNavigate(null);
                    }, (e) => {
                      alert(e);
                    });
                  }
                  else {
                    request = {mainDeck: props.deck["decklist"], mainDeckInfo: deckInfo, mainDeckCount: props.deck["count"], eggDeck: props.eggDeck["decklist"], eggDeckInfo: eggDeckInfo, eggDeckCount: props.eggDeck["count"], status: "Incomplete", title: deckTitle, privacy: privacy, user: props.userDetails["username"]};
                    // console.log(request);
                    props.service.Post("/decks/submit", request, () => {
                      alert("Deck Saved");
                      props.clearData();
                      history.push('/mydecks');
                      props.onNavigate(null);
                    }, (e) => {
                      alert(e);
                    });
                  }
                }}>
                  Save for Later
                </button>
              </div>
              <div className="col btn-group">
                <button type="button" className="btn w-100 btn-success" onClick={() => {
                  if (props.deck["count"] < 50) {
                    alert("Not enough cards in the Main Deck. Either add 50 cards to the Main Deck or click Save for Later.");
                    return;
                  }
                  else {
                    var deckTitle = document.getElementById("deckTitle").value.trim();
                    var privacy = document.getElementById("privacy").checked;
                    var deckInfo = props.deck["deckInfo"];
                    var eggDeckInfo = props.eggDeck["deckInfo"];
                    var cardTypes = {};
                    var colors = {};
                    // var costs = {};
                    var levels = {};
                    var eggColors = {};

                    var mainDeck = [];
                    for (var i=0; i < props.deck["decklist"].length; i++) {
                      mainDeck.push({id: props.deck["decklist"][i]["id"], count: props.deck["decklist"][i]["count"]});
                    }

                    var eggDeck = [];
                    for (var j=0; j < props.eggDeck["decklist"].length; j++) {
                      eggDeck.push({id: props.eggDeck["decklist"][j]["id"], count: props.eggDeck["decklist"][j]["count"]});
                    }


                    Object.keys(deckInfo["cardTypes"]).sort().forEach(function(key) {
                      var temp = {};
                      var count = deckInfo["cardTypes"][key]["count"];
                      Object.keys(deckInfo["cardTypes"][key]["colors"]).sort().forEach(function(color) {
                        temp[color] = deckInfo["cardTypes"][key]["colors"][color];
                      });
                      cardTypes[key] = {colors: temp, count: count};
                    });

                    Object.keys(deckInfo["colors"]).sort().forEach(function(key) {
                      colors[key] = deckInfo["colors"][key];
                    });

                    // Object.keys(deckInfo["costs"]).sort().forEach(function(key) {
                    //   var temp = {};
                    //   var count = deckInfo["costs"][key]["count"];
                    //   Object.keys(deckInfo["costs"][key]["colors"]).sort().forEach(function(color) {
                    //     temp[color] = deckInfo["costs"][key]["colors"][color];
                    //   });
                    //   costs[key] = {colors: temp, count: count};
                    // });

                    Object.keys(deckInfo["levels"]).sort().forEach(function(key) {
                      var temp = {};
                      var count = deckInfo["levels"][key]["count"];
                      Object.keys(deckInfo["levels"][key]["colors"]).sort().forEach(function(color) {
                        temp[color] = deckInfo["levels"][key]["colors"][color];
                      });
                      levels[key] = {colors: temp, count: count};
                    });

                    Object.keys(eggDeckInfo["colors"]).sort().forEach(function(key) {
                      eggColors[key] = eggDeckInfo["colors"][key];
                    });

                    deckInfo["cardTypes"] = cardTypes;
                    // deckInfo["costs"] = costs;
                    deckInfo["colors"] = colors;
                    deckInfo["levels"] = levels;
                    eggDeckInfo["colors"] = eggColors;
                    var request = {}
                    if (props.userDetails["username"] === props.params["user"] && props.params["request"] === "Edit") {
                      request = {_id: props.params["id"], mainDeck: props.deck["decklist"], mainDeckInfo: deckInfo, mainDeckCount: props.deck["count"], eggDeck: props.eggDeck["decklist"], eggDeckInfo: eggDeckInfo, eggDeckCount: props.eggDeck["count"], status: "Complete", title: deckTitle, privacy: privacy, user: props.userDetails["username"], creation: props.params["creation"]};
                      // console.log(request);
                      props.service.Post("/decks/update", request, () => {
                        alert("Deck Saved");
                        props.clearData();
                        history.push('/mydecks');
                        props.onNavigate(null);
                      }, (e) => {
                        alert(e);
                      });
                    }
                    else {
                      request = {mainDeck: props.deck["decklist"], mainDeckInfo: deckInfo, mainDeckCount: props.deck["count"], eggDeck: props.eggDeck["decklist"], eggDeckInfo: eggDeckInfo, eggDeckCount: props.eggDeck["count"], status: "Complete", title: deckTitle, privacy: privacy, user: props.userDetails["username"]};
                      // console.log(request);
                      props.service.Post("/decks/submit", request, () => {
                        alert("Deck Saved");
                        props.clearData();
                        history.push('/mydecks');
                        props.onNavigate(null);
                      }, (e) => {
                        alert(e);
                      });
                    }
                  }
                }}>
                  Submit
                </button>
              </div>
            </div>
          </FormGroup>
        </div>
      </Form>
    </div>
  );
}

export default DeckPanel;
