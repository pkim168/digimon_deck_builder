import React, {useState} from 'react';
import { Collapse } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {HorizontalBar} from 'react-chartjs-2';

function DeckInfo2(props) {
  const [levelsOpen, setLevelsOpen] = useState(true);
  const [colorsOpen, setColorsOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);

  function getColorValue(color) {
    switch (color) {
      case "Black":
        return ["Black", "Black"];

      case "Blue":
        return 	["#0097f4", "Black"];

      case "Green":
        return ["#009c6b", "Black"];

      case "Purple":
        return ["#6456a3", "Black"];

      case "Red":
        return ["#e6002c", "Black"];

      case "White":
        return ["White", "Black"];

      case "Yellow":
        return 	["#ffff00", "Black"];

      default:
        return ["White", "Black"];
    }
  }
  var colors = Object.keys(props.params["mainDeckInfo"]["colors"]);
  var colorValues = [];
  var colorCount = [];
  var borderColors = [];
  for (const color in props.params["mainDeckInfo"]["colors"]) {
    var [colorValue, borderColor] = getColorValue(color);
    colorValues.push(colorValue);
    borderColors.push(borderColor);
    colorCount.push(props.params["mainDeckInfo"]["colors"][color])
  }

  const colorData = {
    labels: colors,
    datasets: [
      {
        barPercentage: 1,
        barThickness: "flex",
        minBarThickness: 30,
        maxBarThickness: 30,
        backgroundColor: colorValues,
        borderColor: borderColors,
        borderWidth: 1,
        hoverBackgroundColor: colorValues,
        hoverBorderColor: borderColors,
        data: colorCount
      }
    ]
  };

  var typeJson = {};
  colors.forEach((color) => {
    typeJson[color] = {
      borderColor: [],
      barColor: [],
      values: []
    };
  });
  var cardTypes = props.params["mainDeckInfo"]["cardTypes"];
  var types = Object.keys(cardTypes);
  for (const type in cardTypes) {
    for (const color in typeJson) {
      var [bar, border] = getColorValue(color);
      if (cardTypes[type]["colors"][color]) {
        typeJson[color]["values"].push(cardTypes[type]["colors"][color])
      }
      else {
        typeJson[color]["values"].push(0);
      }
      typeJson[color]["barColor"].push(bar);
      typeJson[color]["borderColor"].push(border);
    }
  }

  var datasets = []
  Object.keys(typeJson).forEach((color) => {
    datasets.push({
      label: color,
      stack: "key",
      barPercentage: 1,
      barThickness: "flex",
      minBarThickness: 30,
      maxBarThickness: 30,
      backgroundColor: typeJson[color]["barColor"],
      borderColor: typeJson[color]["borderColor"],
      borderWidth: 1,
      hoverBackgroundColor: typeJson[color]["barColor"],
      hoverBorderColor: typeJson[color]["borderColor"],
      data: typeJson[color]["values"]
    })
  });

  const typeData = {
    labels: types,
    datasets: datasets
  };

  // var costJson = {};
  // colors.forEach((color) => {
  //   costJson[color] = {
  //     borderColor: [],
  //     barColor: [],
  //     values: []
  //   };
  // });
  // var costs = props.params["mainDeckInfo"]["costs"]
  // var costKeys = Object.keys(costs);
  // var costKeysLookup = Object.keys(costs);
  // var index = costKeys.findIndex((temp) => temp === '-');
  // if (index > -1) {
  //   costKeys.splice(index, 1);
  //   costKeysLookup.splice(index, 1);
  //   costKeys.unshift(0);
  //   costKeysLookup.unshift('-');
  // }
  // for (var i=0; i<costKeysLookup.length; i++) {
  //   for (const color in costJson) {
  //     [bar, border] = getColorValue(color);
  //     if (costs[costKeysLookup[i]]["colors"][color]) {
  //       costJson[color]["values"].push(costs[costKeysLookup[i]]["colors"][color])
  //     }
  //     else {
  //       costJson[color]["values"].push(0);
  //     }
  //     costJson[color]["barColor"].push(bar);
  //     costJson[color]["borderColor"].push(border);
  //   }
  // }
  //
  // var datasets = [];
  // Object.keys(costJson).forEach((color) => {
  //   datasets.push({
  //     label: color,
  //     stack: "key",
  //     barPercentage: 1,
  //     barThickness: "flex",
  //     minBarThickness: 10,
  //     maxBarThickness: 30,
  //     backgroundColor: costJson[color]["barColor"],
  //     borderColor: costJson[color]["borderColor"],
  //     borderWidth: 1,
  //     hoverBackgroundColor: costJson[color]["barColor"],
  //     hoverBorderColor: costJson[color]["borderColor"],
  //     data: costJson[color]["values"]
  //   })
  // });
  //
  // const costData = {
  //   labels: costKeys,
  //   datasets: datasets
  // };

  var levelJson = {};
  colors.forEach((color) => {
    levelJson[color] = {
      borderColor: [],
      barColor: [],
      values: []
    };
  });
  var levels = props.params["mainDeckInfo"]["levels"];
  var levelKeys = Object.keys(levels);
  var index = levelKeys.findIndex((temp) => temp === '-');
  if (index > -1) {
    levelKeys.splice(index, 1);
  }
  for (const level in levels) {
    if (level === '-')
      continue;
    for (const color in levelJson) {
      [bar, border] = getColorValue(color);
      if (levels[level]["colors"][color]) {
        levelJson[color]["values"].push(levels[level]["colors"][color])
      }
      else {
        levelJson[color]["values"].push(0);
      }
      levelJson[color]["barColor"].push(bar);
      levelJson[color]["borderColor"].push(border);
    }
  }

  datasets = [];
  Object.keys(levelJson).forEach((color) => {
    datasets.push({
      label: color,
      stack: "key",
      barPercentage: 1,
      barThickness: "flex",
      minBarThickness: 30,
      maxBarThickness: 30,
      backgroundColor: levelJson[color]["barColor"],
      borderColor: levelJson[color]["borderColor"],
      borderWidth: 1,
      hoverBackgroundColor: levelJson[color]["barColor"],
      hoverBorderColor: levelJson[color]["borderColor"],
      data: levelJson[color]["values"]
    })
  });

  const levelData = {
    labels: levelKeys,
    datasets: datasets
  };

  return (
    <div className="deck-info-list">
      <div className="colorChart panel-row-chart">
        <div className="titleButton">
          <button type="button" className="btn btn-dark" onClick={() => {setColorsOpen(!colorsOpen)}}>
            Colors
          </button>
        </div>
        <Collapse isOpen={colorsOpen}>
          <HorizontalBar
            data={colorData}
            height={colorData["labels"].length * 30 + 30}
            options={{
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    maxTicksLimit: 11,
                  }
                }],
              },
              legend: {
                display: false,
              },
              tooltips: {
                caretSize: 0,
                enabled: true,
                //mode: 'single',
                callbacks: {
                  label: function (tooltipItem, data) {
                    const tooltip = data.datasets[tooltipItem.datasetIndex];
                    const value = tooltip.data[tooltipItem.index];
                    return value === 0 ? null : value;
                  }
                }
              }
            }}
          />
        </Collapse>
      </div>
      <div className="typeChart panel-row-chart-bottom">
        <div className="titleButton">
          <button type="button" className="btn btn-dark" onClick={() => {setTypesOpen(!typesOpen)}}>
            Types
          </button>
        </div>
        <Collapse isOpen={typesOpen}>
          <HorizontalBar
            data={typeData}
            height={typeData["labels"].length * 30 + 30 + 15*colors.length}
            options={{
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    maxTicksLimit: 11,
                  }
                }]
              },
              legend: {
                display: false,
              },
              tooltips: {
                caretSize: 0,
                enabled: true,
                //mode: 'single',
                callbacks: {
                  label: function (tooltipItem, data) {
                    const tooltip = data.datasets[tooltipItem.datasetIndex];
                    const value = tooltip.data[tooltipItem.index];
                    return value === 0 ? null : value;
                  }
                }
              }
            }}
          />
        </Collapse>
      </div>
      {/*<div className="costChart panel-row-chart">
        <div className="titleButton">
          <button type="button" className="btn btn-dark" onClick={() => {setCostsOpen(!costsOpen)}}>
            Costs
          </button>
        </div>
        <Collapse isOpen={costsOpen}>
          <HorizontalBar
            data={costData}
            height={costData["labels"].length * 30 + 30 + 15*colors.length}
            options={{
              responsive: true,
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    maxTicksLimit: 11,
                  }
                }]
              },
              legend: {
                display: false,
              },
              tooltips: {
                caretSize: 0,
                enabled: true,
                //mode: 'single',
                callbacks: {
                  label: function (tooltipItem, data) {
                    const tooltip = data.datasets[tooltipItem.datasetIndex];
                    const value = tooltip.data[tooltipItem.index];
                    return value === 0 ? null : value;
                  }
                }
              }
            }}
          />
        </Collapse>
      </div>*/}
      <div className="levelChart panel-row-bottom">
        <div className="titleButton">
          <button type="button" className="btn btn-dark" onClick={() => {setLevelsOpen(!levelsOpen)}}>
            Levels
          </button>
        </div>
        <Collapse isOpen={levelsOpen}>
          <HorizontalBar
            data={levelData}
            height={levelData["labels"].length * 30 + 30 + 15*colors.length}
            options={{
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    maxTicksLimit: 11,
                  }
                }]
              },
              legend: {
                display: false,
              },
              tooltips: {
                caretSize: 0,
                enabled: true,
                //mode: 'single',
                callbacks: {
                  label: function (tooltipItem, data) {
                    const tooltip = data.datasets[tooltipItem.datasetIndex];
                    const value = tooltip.data[tooltipItem.index];
                    return value === 0 ? null : value;
                  }
                }
              }
            }}
          />
        </Collapse>
      </div>
    </div>
  );
}

export default DeckInfo2;
