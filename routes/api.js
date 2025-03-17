'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      let conflictArr = [];

      const isValid = solver.validateApiCheck(puzzle, coordinate, value);
      if (isValid.error) return res.json(isValid);

      let checkRowPlacement = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
      let checkColPlacement = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
      let checkRegionPlacement = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);

      if (checkRowPlacement.valid && checkRowPlacement.valid === true) return res.json({ "valid": true });
      
      if (checkRowPlacement.conflict) conflictArr.push("row");
      if (checkColPlacement.conflict) conflictArr.push("column");
      if (checkRegionPlacement.conflict) conflictArr.push("region");
      
      return conflictArr.length > 0 ? res.json({ "valid": false, "conflict": conflictArr }) : res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      const isValid = solver.validate(puzzle);
      if (isValid.error) return res.json(isValid);

      const solved = solver.solve(puzzle);
      if (solved.error) return res.json(solved);
      
      return res.json({ solution: solved });
    });
};
