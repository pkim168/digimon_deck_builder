import React, {useState, useEffect, useCallback } from 'react';
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function FilterMenu(props) {
  const [cardNo, setCardNo] = useState();
  const [isOpen, setIsOpen] = useState(false);

  function filterPages() {
    var deckTitleInput = document.getElementById("deckTitleInput").value.trim();
    var usernameInput = document.getElementById("usernameInput").value.trim();
    var cardNameInput = document.getElementById("cardNameInput").value.trim();
    var cardNoSelect = document.getElementById("cardNoSelect").value;
    if (cardNoSelect === "default")
      cardNoSelect = "";

    var colors = [];
    var andCheckbox = document.getElementById("andCheckbox").checked;
    var blackCheckbox = document.getElementById("blackCheckbox").checked;
    if (blackCheckbox)
      colors.push("Black")
    var blueCheckbox = document.getElementById("blueCheckbox").checked;
    if (blueCheckbox)
      colors.push("Blue")
    var greenCheckbox = document.getElementById("greenCheckbox").checked;
    if (greenCheckbox)
      colors.push("Green")
    var purpleCheckbox = document.getElementById("purpleCheckbox").checked;
    if (purpleCheckbox)
      colors.push("Purple")
    var redCheckbox = document.getElementById("redCheckbox").checked;
    if (redCheckbox)
      colors.push("Red")
    var whiteCheckbox = document.getElementById("whiteCheckbox").checked;
    if (whiteCheckbox)
      colors.push("White")
    var yellowCheckbox = document.getElementById("yellowCheckbox").checked;
    if (yellowCheckbox)
      colors.push("Yellow")
    var empty = !(cardNoSelect || cardNameInput || usernameInput || deckTitleInput || colors.length > 0);

    var deckData = [];

    if (empty) {
      deckData = JSON.parse(sessionStorage.getItem("deckData"))["data"]
      props.setDecks(deckData);
      props.setPages(Math.ceil(deckData.length/props.decksPerPage));
      props.setPage(1);
      return;
    }

    deckData = JSON.parse(sessionStorage.getItem("deckData"))["data"].filter(function (deck) {
      var flag = true;
      if (cardNoSelect) {
        flag = flag && (deck["mainDeck"].filter(function (cards) {
          if (cards["cardNo"] === cardNoSelect)
            return true;
          else
            return false;
        }) || deck["eggDeck"].filter(function (cards) {
          if (cards["cardNo"] === cardNoSelect)
            return true;
          else
            return false;
        }));
      }
      if (cardNameInput) {
        flag = flag && (deck["mainDeck"].filter(function (cards) {
          if (cards["cardName"].toLowerCase() === cardNameInput.toLowerCase())
            return true;
          else
            return false;
        }) || deck["eggDeck"].filter(function (cards) {
          if (cards["cardName"].toLowerCase() === cardNameInput.toLowerCase())
            return true;
          else
            return false;
        }));
      }

      if (usernameInput) {
        flag = flag && (deck["user"].toLowerCase() === usernameInput.toLowerCase());
      }

      if (deckTitleInput) {
        flag = flag && (deck["title"].toLowerCase().includes(deckTitleInput.toLowerCase()));
      }

      if (colors.length > 0) {
        var colorFlag = false;
        if (andCheckbox) {
          colorFlag = true;
          for (var i=0; i < colors.length; i++) {
            if (!deck["mainDeckInfo"]["colors"].hasOwnProperty(colors[i]) && !deck["eggDeckInfo"]["colors"].hasOwnProperty(colors[i])){
              colorFlag = false;
              break;
            }
          }

        }
        else {
          for (var j=0; j < colors.length; j++) {
            if (deck["mainDeckInfo"]["colors"].hasOwnProperty(colors[j]) || deck["eggDeckInfo"]["colors"].hasOwnProperty(colors[j])){
              colorFlag = true;
              break;
            }
          }
        }
        flag = flag && colorFlag;
      }
      return flag;
    });
    props.setDecks(deckData);
    props.setPages(Math.ceil(deckData.length/props.decksPerPage));
    props.setPage(1);
  }

  const getData = useCallback((mounted) => {
    props.service.Get("/cards/cardNo", {}, (data) => {
      if (mounted) {
        let option = data.map((cardNos) => {
          return (
            <option key={"no" + cardNos["cardNo"]} value={cardNos["cardNo"]}>{cardNos["cardNo"]+" "+cardNos["cardName"]}</option>
          );
        });
        setCardNo(option);
      }
    }, (error) => {
      console.log(error);
      setCardNo("");
    })
  }, [props.service]);

  useEffect(() => {

    let mounted = true;
    if (mounted)
      getData(mounted);

    return () => mounted = false;
  },[getData]);

  return (
    <div className="FilterMenu filterMenu-left">
      <Form className="px-4 py-3" id="filter" onSubmit={(e) => {
        e.preventDefault();
        props.setPage(1);
        filterPages();
      }}>
        <h5> Filter Decks </h5>
        <FormGroup row>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText className="bg-dark text-white" > Deck Title </InputGroupText>
            </InputGroupAddon>
            <Input className="bg-dark text-white" name="deckTitleInput" sm="8" id="deckTitleInput" placeholder="Search by Deck Title">
            </Input>
            <InputGroupAddon addonType="append">
              <button type="button" className="btn btn-primary" onClick={() => {setIsOpen(!isOpen)}}>
                Show more filters
              </button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <Collapse isOpen={isOpen}>
          <FormGroup row>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Username </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" name="usernameInput" sm="8" id="usernameInput" placeholder="Search by Username">
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup row>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Card Name </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" name="cardNameInput" sm="8" id="cardNameInput" placeholder="Search by Card Name">
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup row>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText className="bg-dark text-white"> Card No. </InputGroupText>
              </InputGroupAddon>
              <Input className="bg-dark text-white" type="select" name="cardNoSelect" sm="8" id="cardNoSelect" defaultValue="default">
                <option value="default"> -Card No.- </option>
                {cardNo}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup row>
            <InputGroup>
              <Input className="bg-dark text-white" value="Colors" id="colors" style={{textAlign: "center"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText className="bg-dark text-white">
                  AND
                </InputGroupText>
                <InputGroupText className="bg-dark text-white">
                  <Input addon type="checkbox" id="andCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Black" id="black" style={{backgroundColor: "Black", color: "White"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "Black"}}>
                  <Input addon type="checkbox" id="blackCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Blue" id="blue" style={{backgroundColor: "#0097f4", color: "White"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "#0097f4"}}>
                  <Input addon type="checkbox" id="blueCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Green" id="green" style={{backgroundColor: "#009c6b", color: "White"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "#009c6b"}}>
                  <Input addon type="checkbox" id="greenCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Purple" id="purple" style={{backgroundColor: "#6456a3", color: "White"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "#6456a3"}}>
                  <Input addon type="checkbox" id="purpleCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Red" id="red" style={{backgroundColor: "#e6002c", color: "White"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "#e6002c"}}>
                  <Input addon type="checkbox" id="redCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="White" id="white" style={{backgroundColor: "White", color: "Black"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "White"}}>
                  <Input addon type="checkbox" id="whiteCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <Input value="Yellow" id="yellow" style={{backgroundColor: "#ffff00", color: "Black"}} disabled/>
              <InputGroupAddon addonType="append">
                <InputGroupText style={{backgroundColor: "#ffff00"}}>
                  <Input addon type="checkbox" id="yellowCheckbox"/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Collapse>
        <FormGroup row>
          <div className="btn-group w-100" role="group">
            <button type="button" className="btn w-50 btn-danger" onClick={() => {
              document.getElementById("cardNoSelect").value = 'default';
              document.getElementById("deckTitleInput").value = '';
              document.getElementById("cardNameInput").value = '';
              document.getElementById("usernameInput").value = '';
              document.getElementById("andCheckbox").checked = false;
              document.getElementById("blackCheckbox").checked = false;
              document.getElementById("blueCheckbox").checked = false;
              document.getElementById("greenCheckbox").checked = false;
              document.getElementById("purpleCheckbox").checked = false;
              document.getElementById("redCheckbox").checked = false;
              document.getElementById("whiteCheckbox").checked = false;
              document.getElementById("yellowCheckbox").checked = false;
            }}>
              Clear
            </button>
            <button type="submit" className="btn w-50 btn-success">
              Filter
            </button>
          </div>
        </FormGroup>
      </Form>
    </div>
  );
}

export default FilterMenu;
