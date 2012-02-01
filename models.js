var Document;
function extractKeywords(text) {
  if (!text) return [];

  return text.
    split(/\s+/).
    filter(function(v) { return v.length > 2; }).
    filter(function(v, i, a) { return a.lastIndexOf(v) === i; });
}

function defineModels(mongoose, fn) {
   var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;
   Document = new Schema({
    'title': { type: String, index: true },
    'data': String,
    'tags': [String],
    'keywords': [String],
    'user_id': ObjectId
  });
  
    Document.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });
	
	Document.pre('save', function(next) {
    this.keywords = extractKeywords(this.data);
    next();
    });
  mongoose.model('Document', Document);
   fn();
 };
 
exports.defineModels = defineModels; 
  