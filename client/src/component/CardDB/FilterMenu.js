import React, {useState, useEffect, useCallback } from 'react';
import { Form, Input, InputGroup, InputGroupAddon, InputGroupText, Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function FilterMenu(props) {
  const [power, setPower] = useState();
  const [sets, setSets] = useState();
  const [types, setTypes] = useState();
  const [isOpen, setIsOpen] = useState(false);

  function filterPages() {
    var search = document.getElementById("searchInput").value.trim();

    var attributeSelect = document.getElementById("attributeSelect").value;
    if (attributeSelect === "default")
      attributeSelect = "";

    var cardLevelSelect = document.getElementById("cardLevelSelect").value;
    if (cardLevelSelect === "default")
      cardLevelSelect = "";

    var cardNameInput = document.getElementById("cardNameInput").value.trim();

    var cardTypeSelect = document.getElementById("cardTypeSelect").value;
    if (cardTypeSelect === "default")
      cardTypeSelect = "";

    var colorSelect = document.getElementById("colorSelect").value;
    if (colorSelect === "default")
      colorSelect = "";

    var costSelect = document.getElementById("costSelect").value;
    if (costSelect === "default")
      costSelect = "";

    var digivolveSelect = document.getElementById("digivolveSelect").value;
    if (digivolveSelect === "default")
      digivolveSelect = "";

    var formSelect = document.getElementById("formSelect").value;
    if (formSelect === "default")
      formSelect = "";

    var playEffectInput = document.getElementById("playEffectInput").value.trim();

    var powerSelect = document.getElementById("powerSelect").value;
    if (powerSelect === "default")
      powerSelect = "";

    var securityEffectInput = document.getElementById("securityEffectInput").value.trim();

    var setSelect = document.getElementById("setSelect").value;
    if (setSelect === "default")
      setSelect = "";

    var typeSelect = document.getElementById("typeSelect").value;
    if (typeSelect === "default")
      typeSelect = "";

    var raritySelect = document.getElementById("raritySelect").value;
    if (raritySelect === "default")
      raritySelect = "";

    var empty = !(search || attributeSelect || cardLevelSelect || cardNameInput || cardTypeSelect || colorSelect || costSelect || digivolveSelect || formSelect || playEffectInput || powerSelect || securityEffectInput || setSelect || typeSelect || raritySelect);

    var cardData = [];

    if (empty) {
      cardData = JSON.parse(sessionStorage.getItem("cardData"))["data"]
      props.setCards(cardData);
      props.setPages(Math.ceil(cardData.length/props.cardsPerPage));
      props.setPage(1);
      // console.log("Length: "+cardData.length);
      // console.log("Pages: "+Math.ceil(cardData.length/props.cardsPerPage));
      return;
    }

    cardData = JSON.parse(sessionStorage.getItem("cardData"))["data"].filter(function (card) {
      var flag = true;
      if (search) {
        flag = flag && card["fullText"].toLowerCase().indexOf(search.toLowerCase()) > -1;
      }
      if (attributeSelect)
        flag = flag && card['attribute'] === attributeSelect;
      if (cardLevelSelect)
        flag = flag && card["cardLv"] === cardLevelSelect;
      if (cardNameInput) {
        flag = flag && card["cardName"].toLowerCase().indexOf(cardNameInput.toLowerCase()) > -1;
      }
      if (cardTypeSelect)
        flag = flag && card["cardType"] === cardTypeSelect;
      if (colorSelect)
        flag = flag && card["cardColor"] === colorSelect;
      if (costSelect)
        flag = flag && card["playCost"] === costSelect;
      if (digivolveSelect)
        flag = flag && (card["digivolve1Cost"] === digivolveSelect || card["digivolve2Cost"] === digivolveSelect);
      if (formSelect)
        flag = flag && card["form"] === formSelect;
      if (playEffectInput)
        flag = flag && card["effect"].toLowerCase().indexOf(playEffectInput.toLowerCase()) > -1;
      if (powerSelect)
        flag = flag && card["digiPower"] === powerSelect;
      if (securityEffectInput)
        flag = flag && card["securityEffect"].toLowerCase().indexOf(securityEffectInput.toLowerCase()) > -1;
      if (setSelect)
        flag = flag && card["setId"] === setSelect;
      if (typeSelect)
        flag = flag && card["type"] === typeSelect;
      if (raritySelect)
        flag = flag && card["cardRarity"] === raritySelect;
      return flag;
    });
    props.setCards(cardData.sort(props.sortCards()));
    props.setPages(Math.ceil(cardData.length/props.cardsPerPage));
    // console.log(cardData);
    // console.log("Length: "+cardData.length);
    // console.log("Pages: "+Math.ceil(cardData.length/props.cardsPerPage));
    props.setPage(1);
  }

  const getData = useCallback((mounted) => {
    props.service.Get("/cards/power", {}, (data) => {
      if (mounted) {
        let option = data.sort().map((power) => {
          return (
            <option key={"power" + power} value={power}>{power}</option>
          );
        });
        setPower(option);
      }
    }, (error) => {
      console.log(error);
      setPower("");
    })
    if (!mounted)
      return;
    props.service.Get("/cards/sets", {}, (data) => {
      if (mounted) {
        let option = data.sort().map((sets) => {
          return (
            <option key={"set" + sets} value={sets}>{sets}</option>
          );
        });
        setSets(option);
      }
    }, (error) => {
      console.log(error);
      setSets("");
    })
    if (!mounted)
      return;
    props.service.Get("/cards/types", {}, (data) => {
      if (mounted) {
        let option = data.sort().map((types) => {
          return (
            <option key={"type" + types} value={types}>{types}</option>
          );
        });
        setTypes(option);
      }
    }, (error) => {
      console.log(error);
      setTypes("");
    })
    if (!mounted)
      return;
  }, [props.service]);

  useEffect(() => {

    let mounted = true;
    if (mounted)
      getData(mounted);

    return () => mounted = false;
  },[getData]);

  return (
    <div className="FilterMenu w-100">
      <Form className="px-4 py-3" id="filter" onSubmit={(e) => {
        e.preventDefault();
        props.setPage(1);
        filterPages();
      }}>
        <div className="form-row d-flex">
          <div className="form-group-filter-element w-100">
            <div className="form-group">
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="bg-dark text-white"> All Text </InputGroupText>
                </InputGroupAddon>
                <Input className="bg-dark text-white" placeholder="Search Card Text" id="searchInput"/>
                <InputGroupAddon addonType="append">
                  <button type="button" className="btn btn-primary" onClick={() => {setIsOpen(!isOpen)}}>
                    Show more filters
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
        <Collapse isOpen={isOpen}>
          <div className="d-flex form-row flex-wrap justify-content-left">
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend" sm="4" >
                    <InputGroupText className="bg-dark text-white"> Attribute </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="attributeSelect" sm="8" id="attributeSelect" defaultValue="default">
                    <option value="default"> -Attribute- </option>
                    <option value="-"> - </option>
                    <option value="Data"> Data </option>
                    <option value="Free"> Free </option>
                    <option value="Unknown"> Unknown </option>
                    <option value="Vaccine"> Vaccine </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Card Level </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="cardLevelSelect" sm="8" id="cardLevelSelect" defaultValue="default">
                    <option value="default"> -Card Level- </option>
                    <option value="-"> - </option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                    <option value="6"> 6 </option>
                    <option value="7"> 7 </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Card Name </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" name="cardNameInput" sm="8" id="cardNameInput" placeholder="-Card Name-">
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Card Type </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="cardTypeSelect" sm="8" id="cardTypeSelect" defaultValue="default">
                    <option value="default"> -Card Type- </option>
                    <option value="Digi-Egg"> Digi-Egg </option>
                    <option value="Digimon"> Digimon </option>
                    <option value="Option"> Option </option>
                    <option value="Tamer"> Tamer </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Color </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="colorSelect" sm="8" id="colorSelect" defaultValue="default">
                    <option value="default"> -Color- </option>
                    <option value="Black"> Black </option>
                    <option value="Blue"> Blue </option>
                    <option value="Green"> Green </option>
                    <option value="Purple"> Purple </option>
                    <option value="Red"> Red </option>
                    <option value="White"> White </option>
                    <option value="Yellow"> Yellow </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Cost </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="costSelect" sm="8" id="costSelect" defaultValue="default">
                    <option value="default"> -Cost- </option>
                    <option value="-"> - </option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                    <option value="6"> 6 </option>
                    <option value="7"> 7 </option>
                    <option value="8"> 8 </option>
                    <option value="9"> 9 </option>
                    <option value="10"> 10 </option>
                    <option value="11"> 11 </option>
                    <option value="12"> 12 </option>
                    <option value="13"> 13 </option>
                    <option value="14"> 14 </option>
                    <option value="15"> 15 </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Digivolve Cost </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="digivolveSelect" sm="8" id="digivolveSelect" defaultValue="default">
                    <option value="default"> -Digivolve Cost- </option>
                    <option value="-"> - </option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                    <option value="6"> 6 </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Form </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="formSelect" sm="8" id="formSelect" defaultValue="default">
                    <option value="default"> -Form- </option>
                    <option value="-"> - </option>
                    <option value="In-Training"> In-Training </option>
                    <option value="Rookie"> Rookie </option>
                    <option value="Champion"> Champion </option>
                    <option value="Ultimate"> Ultimate </option>
                    <option value="Mega"> Mega </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Effect </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" name="playEffectInput" sm="8" id="playEffectInput" placeholder="-Effect-">
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend" sm="4" >
                    <InputGroupText className="bg-dark text-white"> Power </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="powerSelect" sm="8" id="powerSelect" defaultValue="default">
                    <option value="default"> -Power- </option>
                    {power}
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Rarity </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="raritySelect" sm="8" id="raritySelect" defaultValue="default">
                    <option value="default"> -Rarity- </option>
                    <option value="C"> Common </option>
                    <option value="U"> Uncommon </option>
                    <option value="R"> Rare </option>
                    <option value="SR"> Super Rare </option>
                    <option value="SEC"> Secret Rare </option>
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Security Effect </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" name="securityEffectInput" sm="8" id="securityEffectInput" placeholder="-Security Effect-">
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Set </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="setSelect" sm="8" id="setSelect" defaultValue="default">
                    <option value="default"> -Set- </option>
                    {sets}
                  </Input>
                </InputGroup>
              </div>
            </div>
            <div className="form-group-filter-element">
              <div className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-dark text-white"> Type </InputGroupText>
                  </InputGroupAddon>
                  <Input className="bg-dark text-white" type="select" name="typeSelect" sm="8" id="typeSelect" defaultValue="default">
                    <option value="default"> -Type- </option>
                    {types}
                  </Input>
                </InputGroup>
              </div>
            </div>
          </div>
        </Collapse>
        <div className="form-row">
          <div className="btn-group w-100" role="group">
            <button style={{marginLeft: ".5rem"}} type="button" className="btn w-50 btn-danger" onClick={() => {
              document.getElementById("searchInput").value = '';
              document.getElementById("attributeSelect").value = 'default';
              document.getElementById("cardLevelSelect").value = 'default';
              document.getElementById("cardNameInput").value = '';
              document.getElementById("cardTypeSelect").value = 'default';
              document.getElementById("colorSelect").value = 'default';
              document.getElementById("costSelect").value = 'default';
              document.getElementById("digivolveSelect").value = 'default';
              document.getElementById("formSelect").value = 'default';
              document.getElementById("playEffectInput").value = '';
              document.getElementById("powerSelect").value = 'default';
              document.getElementById("securityEffectInput").value = '';
              document.getElementById("setSelect").value = 'default';
              document.getElementById("typeSelect").value = 'default';
              document.getElementById("raritySelect").value = 'default';
            }}>
              Clear
            </button>
            <button style={{marginRight: ".5rem"}} type="submit" className="btn w-50 btn-success">
              Filter
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default FilterMenu;
