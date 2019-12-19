var mongoose = require('mongoose');
var Schema = mongoose.Schema;

fileSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	location: {
		type: String,
		trim: true,
	},
	uniqid: {
		type: Schema.Types.Mixed,
		trim: true
	}
});


FileUpload = mongoose.model('FileUpload', fileSchema);

module.exports = FileUpload;