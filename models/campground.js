const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//https://res.cloudinary.com/dbwrrqib0/image/upload/w_200/v1706546504/yelpcamp/zipc2uy9stn6hl7xgxkv.jpg

const ImageSchema = new Schema({
    url:'string',
    filename:'string'
});

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        }
    ]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}....</P>`
 })

 campgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
 })

module.exports = mongoose.model('Campground', campgroundSchema);
