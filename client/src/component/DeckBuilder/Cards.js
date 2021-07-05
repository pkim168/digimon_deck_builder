import React from 'react'
import ReactPaginate from 'react-paginate';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import cardBack from '../../assets/card-back.jpg';

function CardsList(props) {
  function addCard(card) {
    props.addCard(card);
  }

  function addEggCard(card) {
    props.addEggCard(card);
  }

  function fillRow(rowCards) {
    let row = rowCards.map((card) => {
      return (
        <div className="card-container col-xl-2 col-lg-3 col-md-4 col-sm-4 col-12" key={card["cardNo"]}>
          <div className="card text-white bg-dark text-left">
            <a href="/#" id={card['cardNo'] + "link"} data-container="body" onClick={(e) => {
              e.preventDefault();
              if (card['cardType'] === "Digi-Egg") {
                addEggCard(card);
              }
              else {
                addCard(card);
              }
            }}>
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
                        <a href="/#" id={card['cardNo'] + "link"} onClick={(e) => {e.preventDefault();}}>
                          <img src={cardBack} className="card-img card-back" alt={card["alt"]}/>
                          <img src={card["src"]} className="card-img card-front" alt={card["alt"]}/>
                        </a>
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

    return row;
  }

  return (
    <>
      {fillRow(props.cards.slice(props.cardsPerPage*(props.page-1), props.cards.length <props.cardsPerPage*props.page ? props.cards.length : props.cardsPerPage*props.page))}
    </>
  );
}

function Cards(props) {

  // useEffect(() => {
  //   console.log(props.cards);
  // });

  function handlePageClick(data) {
    props.setPage(data.selected + 1);
  }

  return (
    <>
      <div className="row d-flex justify-content-center align-items-center pagination-top">
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
      <div className="flex-row flex-grow-1 d-flex db-card-list-container">
        <CardsList {...props}/>
      </div>
    </>
  );
}

export default Cards;
