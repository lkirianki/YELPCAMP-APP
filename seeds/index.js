const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} =require('./seedHelpers');


main().catch(err => { console.log(err); console.log('unable to connect to data base') });
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('data base connected!')

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = array=>array[Math.floor(Math.random()* array.length)]

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i <= 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*30)+10;
        //const n = Math.floor(Math.random()*24)+1;
        const camp = await new campground({
            author:'65af8a5e60cf55d80db165fb',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)}, ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, odit nostrum molestiae laborum, voluptatum exercitationem eligendi iste debitis beatae fugit temporibus, vero soluta alias incidunt! Consequuntur eaque molestiae eos cumque?',
            price,
            geometry:{
              type:"Point",
              coordinates:[
                cities[random1000].longitude,
                 cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dbwrrqib0/image/upload/v1706530742/yelpcamp/tqd9kneakfy0jfv2r9ng.jpg',
                  filename: 'yelpcamp/tqd9kneakfy0jfv2r9ng',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dbwrrqib0/image/upload/v1706530748/yelpcamp/x8o2ljii6wypylwzubts.jpg',
                  filename: 'yelpcamp/x8o2ljii6wypylwzubts',
                 
                },
                {
                  url: 'https://res.cloudinary.com/dbwrrqib0/image/upload/v1706530750/yelpcamp/pynokgnbvkeli47ez9ls.jpg',
                  filename: 'yelpcamp/pynokgnbvkeli47ez9ls',
                  
                }
              ]
        })
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
})