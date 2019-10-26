var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser());
app.use(express.static("views"));
var databaseUrl = "news";
var collections = ["scrapedNews"];
var db = mongojs(databaseUrl, collections);
db.on("error", function(error){
    console.log("database error ", error)
});
app.get("/", function(req,res){
    res.render("index.html");
});
app.get("/all", function(req,res){
    db.scrapedNews.find({}, function(error,found){
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

function updateDB(title){
    db.scrapedNews.update({
        title: title
    }, {$set: {title: title}},
    {upsert: true},
    )
}

app.get("/scrape", function(req,res){
    axios.get("https://www.cnn.com/world").then(function(response){
        var $ = cheerio.load(response.data);
        $("span.cd__headline-text").each(function(i, element){
            var title = $(element).text();
            // if (title && link) {
            db.scrapedNews.insert({
                title: title
            }, function(err, inserted){
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(inserted);
                }
                updateDB();
            });
            // }
        });
    });
    res.send("scraping done");
});

app.listen(3000, () => {
    console.log("server is running");
});