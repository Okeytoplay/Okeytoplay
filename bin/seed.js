const mongoose = require('mongoose');
const Event = require('../models/Event');
// const User = require("../models/User");

mongoose.connect('mongodb://localhost/events', { useNewUrlParser: true });
// mongoose.connect(${ process.env.MONGODB_URI }, {
//   useNewUrlParser: true
// });

const events = [
  {
    establishmentName: 'La Ovella Negra',
    days: 'Sunday',
    schedule: 2019 - 12 - 11,
    description: 'El mejor bar en el barrio del Poblenou',
    bandName: 'Metallica',
    price: 10,
    duration: 120,
  },
  {
    establishmentName: 'La Ovella Blanca',
    days: 'Tuesday',
    schedule: 2019 - 12 - 10,
    description: 'El mediocre bar en el barrio del Poblenou',
    bandName: 'Ozzy the Busy',
    price: 1,
    duration: 20,
  },
  {
    establishmentName: 'La Ovella Pepa',
    days: 'Sunday',
    schedule: 2019 - 12 - 12,
    description: 'El mejor bar en el barrio de la Mina',
    bandName: 'Yustin Vieva',
    price: 10,
    duration: 10,
  },
];
// var User = [
//     {
//     username: joeDoe,
//     email: joeDoe@gmail.com,
//     hashedPassword: #1223344555,
//     description: "String es mejor que bla bla",
//     website: "joedode.com",
//     instagramProfile: "joedode-instagram.com",
//     facebookProfile: "joedode-facebook.com",
//     },
//     // //Com faig un seed en aquest cas agafo un establishment o band?
//     // establishmentName: { type: String, required: true },
//     // street: { type: String, required: true },
//     // city: { type: String, required: true },
//     // zip: { type: Number, required: true },
//     // capacity: { type: Number, required: true },

//     // //Band no entenc com puc fer el seed i demanar els camps obligatoris
//     // bandName: { type: String, required: true },
//     // bandMembers: { type: Number, required: true }
// ];

Event.create(events)
  .then((event) => {
    console.log('inserted event ', event);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });

// User.create(users)
//     .then(user => {
//         console.log("inserted user ", user);
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.log(err);
//         mongoose.connection.close();
//     });
