console.log("This is logic.js")

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


const file_endpoint = "readjsonfile/countries1.geojson"; 
let url = file_endpoint; 
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
              drawGaugePlot(clickedCountry, yearDefault);
              d3.select("#iso").text(feature.properties.ISO_A3)
            } 
          });
          // Pop up to display the country name
          layer.bindPopup("<h3>" + feature.properties.ADMIN + "</h3> <hr>" + "<h4>" + feature.properties.ISO_A3 + "</h4>");
        }  
      }).addTo(myMap);      
    });
  };


function drawPiePlot(Country, Year) {
  d3.json("/data").then(function(data) {
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let cement_co2 = resultYear.cement_co2;
    let cement_co2_per_capita = resultYear.cement_co2_per_capita;
    let co2 = resultYear.co2;
    let co2_per_capita = resultYear.co2_per_capita;
    let coal_co2 = resultYear.coal_co2;
    let coal_co2_per_capita = resultYear.coal_co2_per_capita;
    let countryName = resultYear.country;
    let flaring_co2 = resultYear.flaring_co2;
    let flaring_co2_per_capita = resultYear.flaring_co2_per_capita;
    let gas_co2 = resultYear.gas_co2;
    let gas_co2_per_capita = resultYear.gas_co2_per_capita;
    let gdp = resultYear.gdp;
    let id = resultYear.id;
    let iso_code = resultYear.iso_code;
    let oil_co2 = resultYear.oil_co2;
    let oil_co2_per_capita = resultYear.oil_co2_per_capita;
    let other_co2_per_capita = resultYear.other_co2_per_capita;
    let other_industry_co2 = resultYear.other_industry_co2;
    let population = resultYear.population;
    let share_global_co2 = resultYear.share_global_co2;
    let share_global_cumulative_co2 = resultYear.share_global_cumulative_co2;
    let yearNumber = resultYear.year;

    let trace1 = {
        
        values: [cement_co2, coal_co2, flaring_co2, gas_co2, oil_co2, other_industry_co2],
        labels: ["cement_co2", "coal_co2", "flaring_co2", "gas_co2", "oil_co2", "other_co2"],
        type: "pie"
    }
    let pieArray = [trace1]
    let pieLayout={
        title: `${countryName} in the year ${Year}`,
        margin: {
          b:0,
          t:30,
          l:5,
          r:5,
        }
    }
    Plotly.newPlot("pie_plot", pieArray, pieLayout);    
  });
};

// Chart.js Scatter Plot
function drawScatterPlot(Country, Year) 
{
  d3.json("/data").then(function(data) {
    console.log(data)
    console.log("HELLO", Country, Year)
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let countryName = resultYear.country;

 
    let yearsArray = [];
    let co2Array = [];

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
            label: "CO2 Emissions",
            data: co2Array,
            // fill: false,
            backgroundColor: "rgba(153,205,1,0.6)",
            // borderColor: 'blue',
          },
        ],
      },
    });
  });
};

function drawTable(Country, Year){
  d3.json("/data").then(function(data) {
    console.log(data)
    console.log("HELLO", Country, Year)
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year)[0];
    let cement_co2 = resultYear.cement_co2;
    let cement_co2_per_capita = resultYear.cement_co2_per_capita;
    let co2 = resultYear.co2;
    let co2_per_capita = resultYear.co2_per_capita;
    let coal_co2 = resultYear.coal_co2;
    let coal_co2_per_capita = resultYear.coal_co2_per_capita;
    let countryName = resultYear.country;
    let flaring_co2 = resultYear.flaring_co2;
    let flaring_co2_per_capita = resultYear.flaring_co2_per_capita;
    let gas_co2 = resultYear.gas_co2;
    let gas_co2_per_capita = resultYear.gas_co2_per_capita;
    let gdp = resultYear.gdp;
    let id = resultYear.id;
    let iso_code = resultYear.iso_code;
    let oil_co2 = resultYear.oil_co2;
    let oil_co2_per_capita = resultYear.oil_co2_per_capita;
    let other_co2_per_capita = resultYear.other_co2_per_capita;
    let other_industry_co2 = resultYear.other_industry_co2;
    let population = resultYear.population;
    let share_global_co2 = resultYear.share_global_co2;
    let share_global_cumulative_co2 = resultYear.share_global_cumulative_co2;
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
        align: "center", height: 35,
        line: {width: 1, color: 'black'},
        fill: {color: "grey"},
        font: {family: "Arial", size: 25, color: "white"}
      },
      cells: {
        values: values,
        align: "center", height: 35,
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 16, color: ["black"]}
      }
    }]

    let tablelayout = {
      title:"Miscallaneous Country Info",
      margin: {
        b:0,
        t:30,
        l:5,
        r:5,
      }
    }

    Plotly.newPlot('table', tabledata, tablelayout);
  });
};


function drawGaugePlot(Country, Year) {
  d3.json("/data").then(function(data) {
    console.log(data)
    let resultArray = data.filter(c => c.iso_code == Country);
    let resultYear = resultArray.filter(y => y.year == Year);
    let result = resultYear[0]
    let countryName = resultYear.country;
    let co2 = result.co2;
    let yearNumber = result.year;
    let share_global_co2 = result.share_global_co2;
    let GaugeData = {
      value : share_global_co2 , domain: {x:(0,100)}, gauge:{axis : {range: [0,100], tickwidth: 1, tickcolor: "black", dtick: 10, nticks: 10 }, bar: { color: "darkolivegreen" , thickness: 1}
      }, step:[
        { range: [0, 10], color : "#FF0000" },
        { range: [30, 40], color: "lightgrey" },
        { range: [10, 20], color: "whitesmoke" },
        { range: [20, 30], color: "gainsboro" },
        { range: [40, 50], color: "silver" },
        { range: [50, 60], color: "darkgrey" },
        { range: [60, 70], color: "slategrey" },
        { range: [70, 80], color: "grey" },
        { range: [80, 90], color: "dimgrey" },
        { range: [90, 100], color: "black" }
      ], type: "indicator",
      mode: "gauge+number"};
    
    let GaugeDataArray = [GaugeData];

      // Create a layout object
    let GaugeLayout = {
          title:{text: `Co2 contribution by ${countryName} in the year ${yearNumber}`, font:{size: 15}},
          color : 'blue',

      };

      // Add plotly
    Plotly.newPlot("gauge_plot", GaugeDataArray, GaugeLayout);
  })
};


//--- DASHBOARD FUNCTION START -----------
function InitDashboard() {
  console.log("InitDashboard");
  drawgeoJsonMap();

};
//--- DASHBOARD FUNCTION END -----------

InitDashboard();