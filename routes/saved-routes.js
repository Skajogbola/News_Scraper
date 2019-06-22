const db = require("./models")

module.exports = function (app) {
    app.get("/", function (req, res) {
        let articleObject = {}
        articleObject["articles"] = []

        db.Article.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (found) {
                if (found.length > 0) {
                    for (let i = 0; i < found.length; i++) {
                        newObject = {
                            id: found[i]._id,
                            title: found[i].title,
                            summary: found[i].summary,
                            link: found[i].link,
                            saved: found[i].saved,
                            notes: found[i].notes
                        }

                        articleObject.articles.push(newObject);
                        if (i == (found.length - 1)) {
                            res.render("home", articleObject)
                        }
                    }
                }
                else {
                    res.render("home")
                }
            });
    });

    app.get("/saved", function (req, res) {
        let articleObject = {}
        articleObject["articles"] = []

        db.Article.find({ saved: true }).sort({ date: -1 })
            .then(function (found) {

                if (found.length > 0) {
                    for (let i = 0; i < found.length; i++) {
                        newObject = {
                            id: found[i]._id,
                            title: found[i].title,
                            summary: found[i].summary,
                            link: found[i].link,
                            saved: found[i].saved,
                            notes: found[i].notes
                        }
                        articleObject.articles.push(newObject);
                        if (i == (found.length - 1)) {
                            res.render("saved", articleObject)
                        }
                    }
                }
                else {
                    res.render("saved")
                }
            });
    });
}