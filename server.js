const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const {
  syncAndSeed,
  models: { People, Place, Thing, Souvenir },
} = require("./db");

// use methodOveride module
app.use(methodOverride("_method"));

//body parsing for json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

//GET from "/" send list of people, places, things
app.get("/", async (req, res, next) => {
  try {
    const [pp, pl, th, sv] = await Promise.all([
      People.findAll(),
      Place.findAll(),
      Thing.findAll(),
      Souvenir.findAll({ include: [People, Place, Thing] }),
    ]);

    res.send(`
    <html>
      <link rel ="stylesheet" href="style.css" />
      <header>
        <h1>
        People Places Things Souvenirs
        </h1>
      </header>
        <body>
        <p>
          <form method = "POST" action = "/souvenirs">
            <div>
                    <section class = "title">
                      <label for="person-select">Person</label>
                        <select name = 'personId'>
                        ${pp
                          .map(
                            (ele) =>
                              `<option value =${ele.id} >${ele.name}</option>`
                          )
                          .join("")}
                        </select>
                    </section>
           
                    <section class = "title">
                        <label for="place-select">Place</label>
                        <select name = 'placeId'>
                            ${pl
                              .map(
                                (ele) =>
                                  `<option value =${ele.id} >${ele.name}</option>`
                              )
                              .join("")}
                        </select>
                    </section>
        
                    <section class = "title" >
                    <label for="thing-select">Thing</label>
                        <select name = 'thingId'>
                            ${th
                              .map(
                                (ele) =>
                                  `<option value =${ele.id} >${ele.name}</option>`
                              )
                              .join("")}
                        </select>
                    </section>

                    <section class = "title" >
                      <label for="count-select">Count</label>
                       
                        <input type = "number" name = 'count' min =1 value=1 ></input>
                             
                     
                      </section>
                      <section class = "title" >
                      <label for="count-select">Count</label>
                       
                        <input type = "date" name = 'purchasedAt' value = "2021-05-20"></input>
                             
                     
                      </section>
           
                    <section>
                        <button>Add</button>
                    </section>
            </div>
          </form>
            <div>
                <section class = "title">Souvrnir
                            <ul>
                                ${sv
                                  .map(
                                    (ele) =>
                                      `<form method="POST" action="/souvenirs/${
                                        ele.id
                                      }?_method=DELETE">
                                      <li>
                                      ${ele.person.name} purchased ${
                                        ele.count
                                      } ${
                                        ele.thing.name
                                      } in ${ele.place.name.toUpperCase()} at ${
                                        ele.purchasedAt
                                      }
                                      <button>Delete</button> 
                                      </li>
                                      </form>       
                                  `
                                  )
                                  .join("")}
                              </ul>
                </section>
            </div>
        
        </p>
      </body>
    </html>
    
    
    `);
  } catch (er) {
    next(er);
  }
});

//POST though /souvenirs to add it to model souvenirs
app.post("/souvenirs", async (req, res, next) => {
  try {
    await Souvenir.create(req.body);

    res.redirect("/");
  } catch (er) {
    next(er);
  }
});

//DELETE through /souvenirs/:id, use instance.destroy();then redirect to "/"
app.delete("/souvenirs/:id", async (req, res, next) => {
  try {
    const souvenirDelete = await Souvenir.findByPk(req.params.id);
    souvenirDelete.destroy();
    res.redirect("/");
  } catch (er) {
    next(er);
  }
});

//error handling
app.get("/", (req, res, next) => {
  res.status(500).send("Sorry, something went wrong!");
});

app.use((er, req, res, next) => {
  console.error(er);
  res.status(500).send("Oh no! Something went wrong! :(");
});
// open the port at 1337
app.listen(1337, () => {
  syncAndSeed();
  console.log("app is listening at 1337");
});
