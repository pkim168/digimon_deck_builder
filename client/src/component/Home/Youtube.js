import React, { useEffect, useCallback, useState } from "react";
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
var search = require('youtube-search');
var he = require('he');

function Videos(props) {
  let vids = props.cards.map((video) => {
    var title = he.decode(video["title"]);
    // if (video["title"].length > 36)
    //   title = he.decode(video["title"].substring(0, 36)) + " ...";
    // else
      // title = he.decode(video["title"]);
    var date = new Date(video["publishedAt"]);

    return (
      <div className="row decks-row" key={"row"+video["id"]}>
        <div className="col" id={video["id"]} key={video["id"]}>
          <div className="card text-white bg-dark text-left">
            <div className="row no-gutters">
              <div className="col-5">
                <img className="card-img-top" src={video["thumbnails"]["high"]["url"]} alt={video["title"]}/>
              </div>
              <div className="col-7">
                <div className="card-header" >{title} </div>
                <div className="card-body cards-body" >
                <a className="text-white" href={video["link"]}>
                  <div className="card-block"><div className="card-header"><br/>{" by " + video["channelTitle"] + " on " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</div>
                  </div>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return vids;
}

function Youtube(props) {
  const setDisplay = props.setDisplay;
  const [cards, setCards] = useState([]);

  const getData = useCallback((mounted) => {
    // console.log("Session Storage: " + sessionStorage.getItem('deckData'));
    // console.log("Current Date: " + currentDate);
    var opts = {
      maxResults: 20,
      key: 'AIzaSyDneXt-ITgTz5GOtMYgRFI9J_i59abtHu4',
      order: 'date'
    };

    search('digimon card game 2020', opts, function(err, results) {
      if(err) return console.log(err);
      setDisplay('none');
      console.dir(results);
      setCards(results);
    });
    // axios.get("https://www.googleapis.com/youtube/v3/search", {
    //   params: params
    // })

  }, [setDisplay]);

  useEffect(() => {
    let mounted = true;
    if (mounted)
      getData(mounted);
    return () => mounted = false;
  },[getData]);

  return (
    <div className="row flex-nowrap">
      <div className="col">
        <Videos cards={cards} />
      </div>
    </div>
  );
}

export default Youtube;
