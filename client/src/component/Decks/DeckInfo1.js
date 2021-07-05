import React, {useState} from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText, Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function DeckInfo(props) {
  const [infoOpen, setInfoOpen] = useState(true);

  var date = Date.parse(props.params['creation']);
  date = new Date(date);
  date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();


  return (
    <div className="deck-info-list">
      <div className="deckInfo"  style={{border: "none", padding: "0px"}}>
        <div className="titleButton">
          <button type="button" className="btn btn-dark" onClick={() => {setInfoOpen(!infoOpen)}}>
            Deck Info
          </button>
        </div>
        <Collapse isOpen={infoOpen}>
          <div className="deck-info-container col">
            <div className="row" style={{margin:"0px"}}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="bg-dark text-white"> Deck Title </InputGroupText>
                </InputGroupAddon>
                <Input className="bg-dark text-white" id="deckTitle" value={props.params["title"]} disabled/>
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="bg-dark text-white"> Created By </InputGroupText>
                </InputGroupAddon>
                <Input className="bg-dark text-white" id="createdBy" value={props.params["user"]} disabled/>
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="bg-dark text-white"> Created On </InputGroupText>
                </InputGroupAddon>
                <Input className="bg-dark text-white" id="createdOn" value={date} disabled/>
              </InputGroup>
              <InputGroup>
                <Input className="bg-dark text-white" value="Private" id="private" disabled/>
                <InputGroupAddon addonType="append">
                  <InputGroupText className="bg-dark text-white">
                    <Input addon type="checkbox" id="privacy" checked={props.params["privacy"]} disabled/>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </Collapse>
      </div>

    </div>
  );
}

export default DeckInfo;
