import React from 'react'
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function DecksList(props) {

  function fillRow(rowDecks) {
    let row = rowDecks.map((deck) => {
      if (!deck["privacy"] && deck["status"] === "Complete") {
        var colors = Object.keys(deck["mainDeckInfo"]["colors"]);
        colors = colors.concat(Object.keys(deck["eggDeckInfo"]["colors"]));
        colors = new Set(colors);
        colors = Array.from(colors).join(", ");
        var date = Date.parse(deck['update']);
        date = new Date(date);
        date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ", " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
        return (
          <div className="col" id= {deck["id"]} key={deck["id"]}>
            <div className="card text-white bg-dark text-left">
              <Link className="text-white" to={"/decklist/" + deck["id"]} onClick={() => {
                props.onNavigate(deck);
              }}>
                <div className="card-block"><div className="card-header">{deck['title'] + '  by ' + deck['user'] + ' on ' + date}</div>
                  <div className="row">
                    <div className="col">
                      <div className="card-body">
                        <p className="card-text">{"Colors: " + colors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      }
      return (<></>);
    });
    return row;
  }

  function makeRows() {

    // console.log(props.cards.slice(15*(props.page-1), props.cards.length <15*props.page ? props.cards.length : 15*props.page));

    var decks = props.decks.slice(0, props.decksPerPage);
    var numDecks = 0;
    if (props.decks.length < props.decksPerPage) {
      numDecks = props.decks.length;
    }
    else {
      numDecks = props.decksPerPage;
    }

    var result = [];
    for (var rowNum=1; rowNum<=numDecks; rowNum++) {
      result.push(
        <div className="row decks-row" key={rowNum}>
          {fillRow(decks.slice((rowNum-1)*props.decksInRow, rowNum*props.decksInRow))}
        </div>
      );
    }
    return result;
  }

  return (
    <div className="col">
      {makeRows()}
    </div>
  );
}

function Decks(props) {

  // useEffect(() => {
  //   console.log(props.cards);
  // });

  return (
    <div className="cards">
      <div className="row flex-nowrap decks-list-container">
        <DecksList {...props}/>
      </div>
    </div>
  );
}

export default Decks;
