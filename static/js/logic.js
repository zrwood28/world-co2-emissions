console.log("This is logic.js")

let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3
    
  });

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// function chooseColor(Country, Year) { 
//   d3.json("/data").then(function(data){
//     let resultArray = data.filter(c => c.iso_code == Country);
//     let resultYear = resultArray.filter(y => y.year == Year)[0];
//     let co2 = resultYear.co2;
//     console.log("CO2", co2)
//     if (co2 > 1000) return'#b30000';
//     else if (co2 > 100) return '#e34a33';
//     else if (co2 > 50) return '#fc8d59';
//     else if (co2 > 30) return '#fdbb84';
//     else if (co2 > 10) return '#fdd49e';
//     else if (co2 > 0.1) return 'lightgreen';
//     else return "blue"  
//     })    

// };


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
              drawBarGraph(clickedCountry,yearDefault);
              drawPiePlot(clickedCountry,yearDefault);
              d3.select("#iso").text(feature.properties.ISO_A3)
            } 
          });
          // Pop up to display the country name
          layer.bindPopup("<h3>" + feature.properties.ADMIN + "</h3> <hr>");
          
        }  
      }).addTo(myMap);      
    });
  };


function drawBarGraph(Country, Year) {
    d3.json("/data").then(function(data) {
      console.log(data);
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
          
          x: ["cement_co2", "coal_co2", "flaring_co2", "gas_co2", "oil_co2", "other_co2"],
          y: [cement_co2, coal_co2, flaring_co2, gas_co2, oil_co2, other_industry_co2],          
          type: "bar"
      }
      let barArray = [trace1]
      let layout={
          title: `${countryName} in the year ${Year}`
      }
      Plotly.newPlot("bar_plot", barArray, layout);    
    });
  };

function drawPiePlot(Country, Year) {
  d3.json("/data").then(function(data) {
    console.log(data);
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
    let barArray = [trace1]
    let layout={
        title: `${countryName} in the year ${Year}`
    }
    Plotly.newPlot("pie_plot", barArray, layout);    
  });
};



//--- DASHBOARD FUNCTION START -----------
function InitDashboard() {
  console.log("InitDashboard");
  drawgeoJsonMap();

};
//--- DASHBOARD FUNCTION END -----------

InitDashboard();
