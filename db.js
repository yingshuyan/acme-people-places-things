const Sequelize = require("sequelize");
const { STRING, INTEGER, DATEONLY } = Sequelize;
const db = new Sequelize("postgres://localhost/acme_people_places_things", {
  logging: false,
});

const data = {
  people: ["moe", "larry", "lucy", "ethyl"],
  places: ["paris", "nyc", "chicago", "london"],
  things: ["foo", "bar", "bazz", "quq"],
};

const People = db.define("person", {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});
const Place = db.define("place", {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});
const Thing = db.define("thing", {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Souvenir = db.define("souvenir", {
  count: {
    type: INTEGER,
    defaultValue: 1,
  },
  purchasedAt: {
    type: DATEONLY,
    defaultValue: new Date(),
  },
});

Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

People.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  await data.people.forEach((ele) => People.create({ name: ele }));
  await data.places.forEach((ele) => Place.create({ name: ele }));
  await data.things.forEach((ele) => Thing.create({ name: ele }));
  await Souvenir.create({ personId: 1, placeId: 2, thingId: 3 });
};

module.exports = {
  syncAndSeed,
  models: {
    People,
    Place,
    Thing,
    Souvenir,
  },
};
