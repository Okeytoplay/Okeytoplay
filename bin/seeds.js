require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");
const Establishment = require("../models/Establishment");
const Band = require("../models/Band");

(async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true
    });
    console.log(
      `Connected to Mongo! Database name: "${connection.connections[0].db.s.databaseName}"`
    );
  } catch (err) {
    console.log("Error connecting to Mongo database.", err);
  }
})();

const events = [
  {
    schedule: 2019 - 12 - 11,
    description: "El mejor bar en el barrio del Poblenou",
    bandName: "Metallica",
    price: 10,
    durationMins: 120
  },
  {
    schedule: 2019 - 12 - 10,
    description: "El mediocre bar en el barrio del Poblenou",
    bandName: "Ozzy the Busy",
    price: 1,
    durationMins: 20
  },
  {
    schedule: 2019 - 12 - 12,
    description: "El mejor bar en el barrio de la Mina",
    bandName: "Yustin Vieva",
    price: 10,
    durationMins: 10
  }
];

const users = [
  {
    username: "joeDoe",
    email: "joeDoe@gmail.com",
    hashedPassword: "abcd"
  }
];

const establishments = [
  {
    description: "Bar de Copas centrico....",
    website: "machinebar.com",
    instagramProfile: "machinbarig.com",
    facebookProfile: "machinebarfb.com",
    street: "carrer pujades 21",
    city: "barcelona",
    zip: "08022",
    capacity: 100
  }
];

const bands = [
  {
    description: "Banda de genero punk",
    website: "punkies.com",
    instagramProfile: "punkisig.com",
    facebookProfile: "punkiesfb.com",
    bandMembers: [{ artistName: "pepe" }, { artistInstrument: "juan" }]
  }
];

Event.create(events)
  .then(event => {
    console.log("inserted event ", event);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });

User.create(users)
  .then(user => {
    console.log("inserted user ", user);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });

Establishment.create(establishments)
  .then(establishment => {
    console.log("inserted establishment ", establishment);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });

Band.create(bands)
  .then(band => {
    console.log("inserted band ", band);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
