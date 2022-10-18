console.log("This is logic.js")

// choose map view
let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3,
  });

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(myMap);

// specify bounds to the map
let swCorner = L.latLng(-90, -180);
let neCorner = L.latLng(90, 180);
let boundaries = L.latLngBounds(swCorner, neCorner);

myMap.setMaxBounds(boundaries);
myMap.on("drag", function() {
  map.panInsideBounds(bounds, {animate: false});
});

myMap.options.minZoom = 2;
myMap.options.maxZoom = 6;
myMap.fire("zoomend");

// define geojson location from app.py
const file_endpoint = "readjsonfile/countries1.geojson"; 
let url = file_endpoint; 
//--------- GEOJSON MAP FUNCTION START --------------------------------------------
// Get the GeoJSON data and plot it on the map
function drawgeoJsonMap() {
  d3.json(url).then(function(data) {
      L.geoJson(data, {
          style: function(feature) {
              return {
                color: "white",
                // Call the chooseColor() function to decide which color to color our neighborhood. (The color is based on the borough.)
                fillColor: "lightgreen",
                fillOpacity: 0.5,
                weight: 1.5
              };
            },
          // This is called on each feature.
          onEachFeature: function(feature, layer) {
          // Set the mouse events to change the map styling.
          layer.on({
            // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
            // When a feature (country) is clicked, it enlarges to fit the screen.
            click: function(event) {
              myMap.fitBounds(event.target.getBounds());
              const clickedCountry = feature.properties.ISO_A3;
              console.log(clickedCountry);
              let selector = d3.select("#selDataset");
              let yearDefault = selector.property("value");
              drawGaugePlot(clickedCountry,yearDefault);
              drawPiePlot(clickedCountry,yearDefault);
              drawScatterPlot(clickedCountry, yearDefault);
              drawTable(clickedCountry, yearDefault);
              d3.select("#iso").text(feature.properties.ISO_A3)
            } 
          });
          // Pop up to display the country name
          layer.bindPopup("<h3>" + feature.properties.ADMIN + "</h3> <hr>");
        }  
      }).addTo(myMap);      
    });
  };
//--------- GEOJSON MAP FUNCTION END --------------------------------------------

//--------- PIE CHART PLOT FUNCTION START --------------------------------------------
function drawPiePlot(Country, Year) {
  d3.json("/data").then(function(data) {
    // define variables to use in plots
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let cement_co2 = resultYear.cement_co2;
    let cement_co2_per_capita = resultYear.cement_co2_per_capita;
    let coal_co2 = resultYear.coal_co2;
    let countryName = resultYear.country;
    let flaring_co2 = resultYear.flaring_co2;
    let gas_co2 = resultYear.gas_co2;
    let oil_co2 = resultYear.oil_co2;
    let other_industry_co2 = resultYear.other_industry_co2;

    let ultimateColors =
      ['rgb(17, 100, 180)', 'rgb(12, 152, 186)', 'rgb(48, 191, 191)', 'rgb(141, 216, 204)', 'rgb(13, 173, 141)','rgb(6, 78, 64)']
    let trace1 = {
        
        values: [cement_co2, coal_co2, flaring_co2, gas_co2, oil_co2, other_industry_co2],
        labels: ["Cement", "Coal", "Flaring", "Gas", "Oil", "Other Industrial"],
        type: "pie",
        marker: {
          colors:ultimateColors,
          hoverinfo: 'label+percent+name',
          textinfo: 'none'
        },
    }
    let pieArray = [trace1]
    let pieLayout={
        title: `${countryName} in the year ${Year}`,
        margin: {
          b:0,
          t:30,
          l:15,
          r:15,
        }
    }
    Plotly.newPlot("pie_plot", pieArray, pieLayout);    
  });
};
//--------- PIE CHART PLOT FUNCTION END --------------------------------------------

//--------- SCATTER PLOT FUNCTION START - USING CHARTS.JS --------------------------------------------
function drawScatterPlot(Country, Year) {
  d3.json("/data").then(function(data) {
    // define variables to use in plots
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let countryName = resultYear.country; 
    let yearsArray = [];
    let co2Array = [];

    // loop through to fill in empty lists to use in chart.js table
    for (let i = 0; i < resultArray.length; i++ ) {
      let year = resultArray[i].year
      let co2Result = resultArray[i].co2
      yearsArray.push(year);
      co2Array.push(co2Result);
    }

    var ctx = document.getElementById("scatter_plot").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      
      data: {
        labels: yearsArray,
        datasets: [
          {
            label: `CO2 Emissions in ${countryName} by Year`,
            data: co2Array,
            // fill: false,
            backgroundColor: "rgba(0,77,128,0.6)",
            // borderColor: 'blue',
          },
        ],
      },
    });
  });
};
//--------- SCATTER PLOT FUNCTION END - USING CHARTS.JS --------------------------------------------

//--------- COUNTRY INFO TABLE FUNCTION START --------------------------------------------
function drawTable(Country, Year){
  d3.json("/data").then(function(data) {
    // define variables to use in table
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let co2_per_capita = resultYear.co2_per_capita;
    let countryName = resultYear.country;
    let gdp = resultYear.gdp;
    let population = resultYear.population;
    let share_global_co2 = resultYear.share_global_co2;
    let yearNumber = resultYear.year;

    let values = [
      ['Population', 'GDP', 'CO2 per Capita', 'Global CO2 Contribution (%)'],
      [population, gdp, co2_per_capita, share_global_co2],
   ]

    let tabledata = [{
      type: 'table',
      columnorder: [1,2],
      columnwidth: [5, 5],
      margin: {top:0},
      header: {
        values: [[countryName],  [`Year: ${yearNumber}`]],
        align: "center", height: 25,
        line: {width: 1, color: 'black'},
        fill: {color: "rgb(0, 77, 128)"},
        font: {family: "Arial", size: 18, color: "white"}
      },
      cells: {
        values: values,
        align: "center", height: 25,
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 15, color: ["black"]}
      }
    }]

    let tablelayout = {
      title:"Miscallaneous Country Info",
      margin: {
        b:10,
        t:30,
        l:5,
        r:5,
      }
    }
    Plotly.newPlot('table', tabledata, tablelayout);
  });
};
//--------- COUNTRY INFO TABLE FUNCTION END --------------------------------------------

//--------- TOP 10 TABLE FUNCTION START --------------------------------------------
function drawTableTop(Year){
  d3.json("/data").then(function(data) {
    // define variables to use in table
    let sortedCountry = data.sort(function(a,b) { return +b.co2 - +a.co2 })
    let resultYear = sortedCountry.filter(y => y.year == Year);
    let resultTop = resultYear.slice(1,11);   
    // create empty lists to fill with top 10 countries emitting co2 for current year 
    let countryTop=[];
    let co2Top=[];
    // for loop to populate empty lists
    for (i = 0; i < resultTop.length; i++) {
      console.log(resultTop[i].country)
      console.log(resultTop[i].co2)
      let resultCountry = resultTop[i].country;
      let resultCo2 = resultTop[i].co2;
      countryTop.push(resultCountry);
      co2Top.push(resultCo2);
    }
    
    let values = [
      [countryTop[0], countryTop[1], countryTop[2], countryTop[3], countryTop[4], countryTop[5], countryTop[6], countryTop[7], countryTop[8], countryTop[9]], 
      [co2Top[0], co2Top[1], co2Top[2], co2Top[3], co2Top[4], co2Top[5], co2Top[6], co2Top[7], co2Top[8], co2Top[9]],
    ]

    let tabledata = [{
      type: 'table',
      columnorder: [1,2],
      columnwidth: [5, 5],
      margin: {top:0},
      header: {
        values: [["Country"],  ["Total Co2 Emissions"]],
        align: "center", height: 25,
        line: {width: 1, color: 'black'},
        fill: {color: "rgb(0, 77, 128)"},
        font: {family: "Arial", size: 18, color: "white"}
      },
      cells: {
        values: values,
        align: "center", height: 25,
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 15, color: ["black"]}
      }
    }]

    let tablelayout = {
      title:`Top 10 Contributors to Co2 Emissions in ${Year}`,
      margin: {
        b:0,
        t:30,
        l:5,
        r:5,
      }
    }
    Plotly.newPlot('table_top', tabledata, tablelayout);
  });
};

//--------- TOP 10 TABLE FUNCTION END --------------------------------------------

//--------- GAUGE FUNCTION START --------------------------------------------
function drawGaugePlot(Country, Year) {
  d3.json("/data").then(function(data) {
    // define variables to use in plots
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year);
    let result = resultYear[0]
    let countryName = result.country;
    let co2 = result.co2;
    let yearNumber = result.year;
    let share_global_co2 = result.share_global_co2;
    let GaugeData = { 
      type: "indicator",
      mode: "gauge+number",
      value : co2 , 
      domain: { x: [0, 1], y: [0, 1] },
      title:{text: `Co2 contribution by ${countryName} in the year ${yearNumber}`, font:{color:"rgb(0, 77, 128)" , size: 15}},
      gauge:{
                bar: { color: "rgb(0, 77, 128)", thickness: 0.25, line: {color: "blue", width: 1}},
        axis : {range: [null,12000], dtick: 2000},       
        steps: [
          { range: [10000,12000], color: 'rgb(100,100,100)'},
          { range: [8000,10000], color: 'rgb(125,125,125)'},
          { range: [6000,8000], color: 'rgb(150,150,150)'},
          { range: [4000,6000], color: 'rgb(175,175,175)'},
          { range: [2000,4000], color: 'rgb(200,200,200)'},
          { range: [0,2000], color: 'rgb(225,225,225)'},
        ]        
        }};
    
    let GaugeDataArray = [GaugeData];

    // Create a layout object
    let GaugeLayout = {
        margin: { t: 0, b: 0}
      };
    // Add plotly
    Plotly.newPlot("gauge_plot", GaugeDataArray, GaugeLayout);
  })
};
//--------- GAUGE FUNCTION END --------------------------------------------

//--- DASHBOARD FUNCTION START -----------
function InitDashboard() {
  console.log("InitDashboard");
  drawgeoJsonMap();

};
//--- DASHBOARD FUNCTION END -----------

// call initialization of dashboard
InitDashboard();