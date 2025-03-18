const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require("chai-http");
const server = require("../server.js");


chai.use(chaiHttp);

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzle = '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validPuzzleRes = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite('Functional Tests', () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done){
        chai
            .request(server)
            .post("/api/solve")
            .send({
               puzzle: validPuzzle 
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "solution");
                assert.isString(res.body.solution);
                assert.equal(res.body.solution, validPuzzleRes);
                done();
            })
    });
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done){
        chai
            .request(server)
            .post("/api/solve")
            .send({})
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Required field missing");
                done();
            })
    })
    test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done){
        chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: "*y" + validPuzzle.slice(2)
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Invalid characters in puzzle")
                done();
            })
    });
    test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done){
        chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: validPuzzle + "675"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            })
    })
    test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done){
        chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: invalidPuzzle
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Puzzle cannot be solved");
                done();
            })
    })
    test("Check a puzzle placement with all fields: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle,
                coordinate: "A2",
                value: "3"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "valid");
                assert.equal(res.body.valid, true);
                done();
            })
    })
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
             puzzle: validPuzzle,
             coordinate: "B4",
             value: "5"   
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "valid");
                assert.property(res.body, "conflict");
                assert.isArray(res.body.conflict);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                assert.equal(res.body.conflict[0], "region");
                done();
            })
    })
    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle,
                coordinate: "B4",
                value: "2"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "valid");
                assert.property(res.body, "conflict");
                assert.isArray(res.body.conflict);
                assert.equal(res.body.valid, false);
                assert.isAtLeast(res.body.conflict.length, 2);
                done();
            })
    });
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle,
                coordinate: "B2",
                value: "2"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "valid");
                assert.property(res.body, "conflict");
                assert.isArray(res.body.conflict);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                done();
            })
    });
    test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({})
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            })
    });
    test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send(
                {
                    puzzle: "ty" + validPuzzle.slice(2),
                    coordinate: "A2",
                    value: "3"
                }
            )
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            })
    });
    test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle + "789",
                coordinate: "A2",
                value: "2"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            })
    });
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle,
                coordinate: "Z4",
                value: "2"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            })
    });
    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done){
        chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: validPuzzle,
                coordinate: "A2",
                value: "14"
            })
            .end((err, res) => {
                assert.isObject(res.body);
                assert.property(res.body, "error");
                assert.equal(res.body.error, "Invalid value");
                done();
            })
    });
});