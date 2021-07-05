import React from 'react'
import ReactPaginate from 'react-paginate';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function CardsList(props) {

  function fillRow(rowCards) {
    let row = rowCards.map((card) => {
      return (
        <div className="card-container col-lg-4 col-md-6 col-sm-12" key={card+card["cardNo"]}>
          <div className="card text-left" key={card["cardNo"]}>
            <div className="row no-gutters">
              <div className="col-5">
                <a href="/#" id={card['cardNo'] + "link"}>
                  <img src={card["src"]} className="card-img" alt="..."/>
                </a>
              </div>
              <div className="col-7">
                <div className="card-header" >{card['cardNo'] + ' ' + card['cardName']}</div>
                <div className="card-body cards-body" >
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
    <div className="cards">
      <div className="row justify-content-center align-items-center pagination-top">
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'page-item disabled'}
          breakLinkClassName={'page-link'}
          pageCount={props.pages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageClassName={'page-item'}
          forcePage={props.page-1}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
      <div className="row d-flex card-list-container">
        <CardsList cards={props.cards} page={props.page} cardsInRow={props.cardsInRow} cardsPerPage={props.cardsPerPage} rowsPerPage={props.rowsPerPage}/>
      </div>
    </div>
  );
}

export default Cards;
