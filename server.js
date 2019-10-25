var cheerio = require("cheerio");
var axios = require("axios");
axios.get("https://www.cnn.com/world").then(function(response){
    var $ = cheerio.load(response.data);
    var results = [];
    $("span.cd__headline-text").each(function(i,element){
        var title = $(element).text();
        results.push({
            title: title
        });
    });
    console.log(results);
});