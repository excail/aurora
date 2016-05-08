var mongoose = require('mongoose');

var StorySchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Story', StorySchema);
