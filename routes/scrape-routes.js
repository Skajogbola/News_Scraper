// Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models")

//Routes
module.exports = function (app) {
  // Scrape articles
  app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
      const $ = cheerio.load(response.data);
      $("article").each(function (i, element) {
        const result = {};

        result.title = $(this).find("h2").text();
        result.summary = $(this).find("li").text();
        result.link = $(this).find("a").attr("href");

        //Create a New Article
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
      res.redirect("/")
      console.log("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/api/all", function (req, res) {
    db.Article.find({ $query: { saved: false } }).sort({ date: -1 })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //Routes for the Note
  app.get("/api/notes/all", function (req, res) {

    db.Note.find({})
      .then(function (response) {
        res.json(response)
        // res.json(response)
      })
  });

  // delete
  app.delete("/api/reduce", function (req, res) {

    db.Article.find({ $query: { saved: false } }).sort({ date: -1 })
      .then(function (found) {

        console.log(found.length);
        let countLength = found.length;
        let overflow = countLength - 25;
        console.log(overflow)
        let overflowArray = [];

        for (var i = 0; i < (overflow); i++) {
          overflowArray.push(found[25 + i]._id);
          console.log(overflowArray)
        }

        db.Article.remove({ _id: { $in: overflowArray } }, function (error, result) {
          result["length"] = countLength;
          console.log(result)
          res.json(result)
        })
      });
  })

  app.put("/api/save/article/:id", function (req, res) {
    let articleId = req.params.id;

    db.Article.findOneAndUpdate(
      { _id: articleId },
      {
        $set: { saved: true }
      }
    ).then(function (result) {
      res.json(result)
    })
  });


  app.put("/api/delete/article/:id", function (req, res) {
    let articleId = req.params.id;

    db.Article.findOneAndUpdate(
      { _id: articleId },
      {
        $set: { saved: false }
      }
    ).then(function (result) {
      res.json(result)
    })
  });

  app.get("/api/notes/:id", function (req, res) {
    db.Article.findOne(
      { _id: req.params.id }
    )
      .populate("note")
      .then(function (result) {
        res.json(result)
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/api/create/notes/:id", function (req, res) {
    console.log(req.body);

    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // delete Article documents manually if needed
  app.get("/api/clear", function (req, res) {

    db.Article.remove()
      .then(function () {
        res.json("documents removed from headline collection")
      })
  });

  // delete Note
  app.delete("/api/delete/notes/:id", function (req, res) {

    db.Note.remove(
      { _id: req.params.id }
    )
      .then(function (result) {
        res.json(result)
      })
  });

}