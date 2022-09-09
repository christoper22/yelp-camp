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
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '6319b9076876702d66486271',
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem rem numquam ut officia provident quam ea! Ducimus ex quo tempore autem minima placeat aspernatur. Asperiores debitis hic maiores aut non.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/djicld7or/image/upload/v1662642148/amfeywy5ggtntfiotpvk.jpg',
          filename: 'amfeywy5ggtntfiotpvk',
        },
        {
          url: 'https://res.cloudinary.com/djicld7or/image/upload/v1662642177/djg2zncd3fesv99xx1sx.jpg',
          filename: 'djg2zncd3fesv99xx1sx',
        },
        {
          url: 'https://res.cloudinary.com/djicld7or/image/upload/v1662642171/yrc6ykpr3mk9vn1v8m3h.jpg',
          filename: 'yrc6ykpr3mk9vn1v8m3h',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
