console.log("This is logic.js")

d3.json("/data").then(function (data) {
    console.log(data);

    keys = Object.keys(data);
    values = Object.values(data);


});

