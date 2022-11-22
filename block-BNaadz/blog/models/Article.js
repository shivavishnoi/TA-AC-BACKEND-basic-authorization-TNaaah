var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId] , ref: "Comment"},
    author: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

articleSchema.pre('save', function (next) {
  this.slug = slugify(this.title, '_');
  next();
});

module.exports = mongoose.model('Article', articleSchema);
