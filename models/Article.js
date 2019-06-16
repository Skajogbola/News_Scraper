const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    summary: {
        type: String
    },
    link: {
        type: String,
        
    },
    date: {
        type: Date
    },
    // To save article
    saved: {
        type: Boolean,
        default: false,
    },
    // To delete article
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    // To take notes
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note",
        }
    ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;