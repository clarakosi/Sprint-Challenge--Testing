const mongoose = require("mongoose");
const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const chaihtttp = require("chai-http");

const Game = require("./models");
const server = require("./server");
chai.use(chaihtttp);

describe("Games", () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/test");
    const db = mongoose.connection;
    db.on("error", () => console.error.bind(console, "connection error"));
    db.once("open", () => {
      console.log("we are connected");
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log("we are disconnected");
    });
  });

  let gameId;
  let marioGame;
  
  beforeEach(done => {
    const newGame = new Game({
      title: "California Games",
      genre: "Sports",
      date: "June 1987"
    });

    newGame
      .save()
      .then(game => {
        gameId = game.id;
        marioGame = game;
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });
  afterEach(done => {
    Game.remove({}, error => {
      if (error) console.error(error);
      done();
    });
  });

  // test the POST here
  describe("[POST] /api/game/create", () => {
    it("should add a new game", done => {
      const myGame = new Game({
        title: "Super Mario Bros.",
        genre: "Action",
        date: "September 1985"
      });
      chai
        .request(server)
        .post("/api/game/create")
        .send(myGame)
        .end((err, res) => {
          expect(res.body.title).to.equal("Super Mario Bros.");
          expect(res.body).to.be.a("object");
          done();
        });
    });
    it("should return a 422 error", done => {
      const myGame = {
        genre: "Sport",
        date: "June 1987"
      };
      chai
        .request(server)
        .post("/api/game/create")
        .send(myGame)
        .end((err, res) => {
          if (err) {
            expect(err.status).to.equal(422);
            expect(err.response.body.error).to.equal(
              "Error saving data to the DB"
            );
            done();
          }
        });
    });
  });

  // test the GET here

  // test the PUT here

  // --- Stretch Problem ---
  // Test the DELETE here
});
