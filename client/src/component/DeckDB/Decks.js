import React from 'react'
import ReactPaginate from 'react-paginate';
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
    var decks = props.decks.slice(props.decksPerPage*(props.page-1), props.decks.length <props.decksPerPage*props.page ? props.decks.length : props.decksPerPage*props.page);

    var numDecks = 0;
    if (decks.length < props.rowsPerPage) {
      numDecks = decks.length;
    }
    else {
      numDecks = props.rowsPerPage;
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

  function handlePageClick(data) {
    props.setPage(data.selected + 1);
  }

  return (
    <>
      <div className="row justify-content-center align-items-center pagination-top">
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'page-item disabled'}
          breakLinkClassName={'page-link text-white bg-dark'}
          pageCount={props.pages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageClassName={'page-item'}
          forcePage={props.page-1}
          pageLinkClassName={'page-link text-white bg-dark'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link text-white bg-dark'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link text-white bg-dark'}
          activeClassName={'active'}
        />
      </div>
      <div className="flex-row flex-grow-1 d-flex flex-nowrap decks-list-container">
        <DecksList {...props}/>
      </div>
    </>
  );
}

export default Decks;
