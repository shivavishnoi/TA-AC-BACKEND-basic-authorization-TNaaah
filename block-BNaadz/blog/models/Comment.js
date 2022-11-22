var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
