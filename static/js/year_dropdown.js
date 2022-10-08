console.log("yeardropdown connected");

function optionChanged(yearSelected) {

    console.log(`User selected year: ${yearSelected}`);

};


function dropdown() {

    let firstYear = 1972;
    let finalYear = 2020;

    // Code found here:
    // https://jasonwatmore.com/post/2021/10/02/vanilla-js-create-an-array-with-a-range-of-numbers-in-a-javascript
    let range = [...Array(finalYear - firstYear + 1).keys()].map(x => x + firstYear);
    
    console.log(range);

    let selector = d3.select("#selDataset");

    d3.json('/data').then(function(data) {
        console.log(data);
    });

    for (let year = 0; year < range.length; year++) {
        let yearSelected = range[year]; 
        selector.append("option").text(yearSelected).property("value", yearSelected);
    };
    
    let yearDefault = selector.property("value");

};

dropdown();

