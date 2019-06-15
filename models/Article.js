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
        unique: true,
        required: true
    },
    date: {
        type: Date
    },
    // To save article
    saved: {
        type: Boolean,
        default: false,
        required: true
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
            required: false
        }
    ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;