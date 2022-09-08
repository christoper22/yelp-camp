const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose
  .connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DATABASE CONNECTED');
  })
  .catch((err) => {
    console.log('CANNOT CONNECT DATABASE');
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '6319b9076876702d66486271',
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem rem numquam ut officia provident quam ea! Ducimus ex quo tempore autem minima placeat aspernatur. Asperiores debitis hic maiores aut non.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/djicld7or/image/upload/v1662627917/zrmeexrkyfe1lmmxzbvr.jpg',
          filename: 'zrmeexrkyfe1lmmxzbvr',
        },
        {
          url: 'https://res.cloudinary.com/djicld7or/image/upload/v1662627946/jetm3a4uk73bhftopdps.png',
          filename: 'jetm3a4uk73bhftopdps',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
