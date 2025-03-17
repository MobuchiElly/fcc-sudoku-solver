'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      let conflictArr = []

      const check = solver.validateApiCheck(puzzle, coordinate, value);
      if (check.error) return res.json(check);
      let checkRowPlacement = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
      let checkColPlacement = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
      let checkRegionPlacement = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);
      
      if(checkRowPlacement.valid && checkRowPlacement.valid == true) return res.json({ "valid": true });
      if (checkRowPlacement.conflict) conflictArr.push("row");
      if (checkColPlacement.conflict) conflictArr.push("column");
      if (checkRegionPlacement.conflict) conflictArr.push("region");
      
      return conflictArr.length > 0 ? res.json({ "valid": false, "conflict": conflictArr }) : res.json({ valid : true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      console.log(req.body)
      const check = solver.validate(puzzle);
      if(check.error) return res.json(check);
      // return res.json({'solution': '135762984946381257728459613694517832812936745357824196473298561581673429269145378'});
    });
};
