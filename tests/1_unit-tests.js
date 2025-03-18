const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', function(){
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const invalidPuzzle = '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    
    test("Logic handles a valid puzzle string of 81 characters", function(){
        assert.equal(solver.validate(validPuzzle), true);
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function(){
        assert.isObject(solver.validate(invalidPuzzle));
        assert.property(solver.validate(invalidPuzzle), "error");
    });
    test("Logic handles a puzzle string that is not 81 characters in length", function(){
        assert.isObject(solver.validate(validPuzzle + '78'));
        assert.property(solver.validate(validPuzzle + '78'), "error");
        assert.equal(solver.validate(validPuzzle + '78').error, "Expected puzzle to be 81 characters long");
    });
    test("Logic handles a valid row placement", function(){
        assert.isObject(solver.checkRowPlacement(validPuzzle, "A", "2", "3"));
        assert.property(solver.checkRowPlacement(validPuzzle, "A", "2", "3"), "valid");
        assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "3").valid, true);
    });
    test("Logic handles an invalid row placement", function(){
        assert.isObject(solver.checkRowPlacement(validPuzzle, "A", 2, 3));
        assert.property(solver.checkRowPlacement(validPuzzle, "A", 2, 8), "valid");
        assert.equal(solver.checkRowPlacement(validPuzzle, "A", 2, 8).valid, false);
    });
    test("Logic handles a valid column placement", function(){
        assert.isObject(solver.checkColPlacement(validPuzzle, "B", 4, 4));
        assert.property(solver.checkColPlacement(validPuzzle, "B", 4, 4), "valid");
        assert.equal(solver.checkColPlacement(validPuzzle, "B", 4, 4).valid, true);
    });
    test("Logic handles an invalid column placement", function(){
        assert.isObject(solver.checkColPlacement(validPuzzle, "C", "3", "9"));
        assert.property(solver.checkColPlacement(validPuzzle, "C", "3", "9"), "valid");
        assert.property(solver.checkColPlacement(validPuzzle, "C", "3", "9"), "conflict");
        assert.equal(solver.checkColPlacement(validPuzzle, "C", "3", "9").valid, false);
        assert.equal(solver.checkColPlacement(validPuzzle, "C", "3", "9").conflict, "column");
    });
    test("Logic handles a valid region (3x3 grid) placement", function(){
        assert.isObject(solver.checkRegionPlacement(validPuzzle, 'B', 4, 4));
        assert.property(solver.checkRegionPlacement(validPuzzle, 'B', 4, 4), "valid");
        assert.equal(solver.checkRegionPlacement(validPuzzle, 'B', 4, 4).valid, true);
    });
    test("Logic handles an invalid region (3x3 grid) placement", function(){
        assert.isObject(solver.checkRegionPlacement(validPuzzle, 'B', "2", "5"));
        assert.property(solver.checkRegionPlacement(validPuzzle, 'B', "2", "5"), "conflict");

    });
    test("Valid puzzle strings pass the solver", function(){
        assert.equal(solver.solve(validPuzzle), "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
    });
    test("Invalid puzzle strings fail the solver", function(){
        assert.isObject(solver.solve(invalidPuzzle));
        assert.property(solver.solve(invalidPuzzle), "error");
        assert.equal(solver.solve(invalidPuzzle).error, "Puzzle cannot be solved");
    });
    test("Solver returns the expected solution for an incomplete puzzle", function(){
        assert.equal(solver.solve(validPuzzle), "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
    });
});