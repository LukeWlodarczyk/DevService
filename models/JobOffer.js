const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobOfferSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  company: {
    type: String,
  },
  email: {
    type: String,
  },
  telephone: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  position: {
    type: String,
  },
  requirements: {
    type: [String],
  },
  niceToHave: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  canOffer: {
    type: [String],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = JobOffer = mongoose.model('jobOffer', JobOfferSchema);
