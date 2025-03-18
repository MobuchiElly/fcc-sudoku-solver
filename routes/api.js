"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    let conflictArr = [];

    const isValid = solver.validateApiCheck(puzzle, coordinate, value);
    
    if (isValid.error) return res.json(isValid);
    
    let row = coordinate[0].toUpperCase();
    let column = parseInt(coordinate.slice(1));

    let checkRow = solver.checkRowPlacement(puzzle, row, column, value);
    let checkCol = solver.checkColPlacement(puzzle, row, column, value);
    let checkRegion = solver.checkRegionPlacement(puzzle, row, column, value);
    
    if (checkRow.valid && checkRow.msg) return res.json({ valid: true }); 
    if (checkRow.valid && checkCol.valid && checkRegion.valid) {
      return res.json({ valid: true });
    }

    if (checkRow.conflict) conflictArr.push("row");
    if (checkCol.conflict) conflictArr.push("column");
    if (checkRegion.conflict) conflictArr.push("region");

    return res.json({ valid: false, conflict: conflictArr });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    const validate = solver.validate(puzzle);
    if (validate.error) return res.json(validate);

    const solved = solver.solve(puzzle);
    if (solved.error) return res.json(solved);
    return res.json({ solution: solved });
  });
};
