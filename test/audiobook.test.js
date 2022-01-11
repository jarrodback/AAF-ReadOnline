let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

let mongoose = require("mongoose");
let Animal = require("../models/audiobook.model");

chai.use(chaiHttp);

describe("Testing the /audiobooks path", () => {
    //Testing GET /audiobooks
    describe("GET /audiobooks", () => {
        it("it should return a welcome message", (done) => {
            chai.request(server)
                .get("/audiobooks")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.have
                        .property("message")
                        .eql("Welcome to the audiobooks api.");

                    done();
                });
        });
    });

    //Testing GET /petshop/pets
    // describe("GET /petshop/pets", () => {
    //     it("should GET all the animals", (done) => {
    //         chai.request(server)
    //             .get("/petshop/pets")
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a("array");
    //                 res.body.length.should.not.be.eql(0);

    //                 done();
    //             });
    //     });
    // });

    describe("POST /audiobooks/pets", () => {
        // it("it should not POST an animal without name field", (done) => {
        //     let animal = {
        //         species: "dog",
        //         breed: "caninus canine",
        //         age: 12,
        //         colour: "yellow",
        //     };
        //     chai.request(server)
        //         .post("/petshop/pets")
        //         .send(animal)
        //         .end((err, res) => {
        //             res.should.have.status(400);
        //             res.should.be.a("object");
        //             res.body.should.have.property("message");
        //             res.body.message.should.be.eql("Content can not be empty!");

        //             done();
        //         });
        // });

        it("it should POST an audio book", (done) => {
            let audioBook = {
                name: "fido",
                datePublished: new Date(),
                cost: "40.00",
            };
            chai.request(server)
                .post("/audiobooks/audiobooks")
                .send(audioBook)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("_id");
                    res.body.should.have.property("name");
                    res.body.should.have.property("datePublished");
                    res.body.should.have.property("cost");

                    done();
                });
        });
    });
});
