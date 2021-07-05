import React from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import cardBack from '../../assets/card-back.jpg';

function EggDeck(props) {

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

  var result = props.params["eggDeck"].map((card, i) => {
    if (!card)
      return(<></>);
    var [backgroundColor, textColor] = getColorValue(card["cardColor"]);
    return (
      <FormGroup className="deck-row" key={card["cardNo"] + card["cardName"]} row>
        <InputGroup>
          <Input value={card["cardNo"] + " " + card["cardName"]} id={card["cardNo"] + "row"} style={{backgroundColor: backgroundColor, color: textColor}} disabled/>
          <UncontrolledPopover delay={{"show": 250}} className={"card-builder-popover"} boundariesElement="body" placement="auto" trigger="hover" target={card['cardNo'] + "row"}>
            <PopoverHeader className="bg-dark text-white">{card['cardNo'] + ' ' + card['cardName']}</PopoverHeader>
            <PopoverBody className="bg-dark text-white">
              <div className="bg-dark text-white card text-left" key={card["cardNo"]}>
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
            <InputGroupText className="bg-dark text-white"> {card["count"]} </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    )
  });
  return result;
}

export default EggDeck;
