class SudokuSolver {
  validatePuzzle(puzzleString) {
    let regex = /^[1-9.]+$/;
    if (!puzzleString) return { error: "Required field missing" };
    if (!regex.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };
    return true;
  }

  validate(puzzleString) {
    const validation = this.validatePuzzle(puzzleString);
    if (validation !== true) return validation;

    // Check rows for duplicates
    for (let row = 0; row < 9; row++) {
      let seen = new Set();
      for (let col = 0; col < 9; col++) {
        let value = puzzleString[row * 9 + col];
        if (value !== "." && seen.has(value)) {
          return { error: "Puzzle cannot be solved" };
        }
        seen.add(value);
      }
    }

    // Check columns for duplicates
    for (let col = 0; col < 9; col++) {
      let seen = new Set();
      for (let row = 0; row < 9; row++) {
        let value = puzzleString[row * 9 + col];
        if (value !== "." && seen.has(value)) {
          return { error: "Puzzle cannot be solved" };
        }
        seen.add(value);
      }
    }

    // Check regions for duplicates
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        let seen = new Set();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            let value = puzzleString[(boxRow * 3 + row) * 9 + (boxCol * 3 + col)];
            if (value !== "." && seen.has(value)) {
              return { error: "Puzzle cannot be solved" };
            }
            seen.add(value);
          }
        }
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowIndex = row.charCodeAt(0) - "A".charCodeAt(0);
    let colIndex = column - 1;
    let puzzleIndex = rowIndex * 9 + colIndex;

    // If the value already placed correctly at given position, return valid: true
    if (puzzleString[puzzleIndex] === value) {
        return { valid: true, msg: "valid value and position" };
    }

    let rowStartIndex = rowIndex * 9;
    let rowSubstring = puzzleString.slice(rowStartIndex, rowStartIndex + 9);

    // If value exists in row, return conflict
    if (rowSubstring.includes(value)) {
        return { valid: false, conflict: ["row"] };
    }

    return { valid: true };
}

  checkColPlacement(puzzleString, row, column, value) {
    let colIndex = column - 1;
    for (let i = colIndex; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return { valid: false, conflict: ["column"] };
      }
    }
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowIndex = row.charCodeAt(0) - "A".charCodeAt(0);
    let rowStartIndex = Math.floor(rowIndex / 3) * 3;
    let colStartIndex = Math.floor((column - 1) / 3) * 3;

    for (let i = rowStartIndex; i < rowStartIndex + 3; i++) {
      for (let j = colStartIndex; j < colStartIndex + 3; j++) {
        if (puzzleString[i * 9 + j] === value)
          return { valid: false, conflict: ["region"] };
      }
    }
    return { valid: true };
  }

  validateApiCheck(puzzleString, coordinate, value) {
    let regex = /^[1-9]$/;
    let regex2 = /^[1-9.]+$/;

    if (!puzzleString || !value || !coordinate)
      return { error: "Required field(s) missing" };
    if (!regex2.test(puzzleString)) return { error: "Invalid characters in puzzle" };
    if (puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };
    if (!regex.test(value.trim())){ return { error: "Invalid value" };}

    let row = coordinate[0].toUpperCase();
    let column = parseInt(coordinate.slice(1));

    if (isNaN(column) || column < 1 || column > 9 || row < "A" || row > "I") {
      return { error: "Invalid coordinate" };
    } 
    return true;
  }

  solve(puzzleString) {
    const solveRecursive = (puzzle) => {
      let emptyIndex = puzzle.indexOf(".");
      if (emptyIndex === -1) return puzzle;

      let row = Math.floor(emptyIndex / 9);
      let column = emptyIndex % 9;
      let rowLetter = String.fromCharCode(65 + row);
      let columnNumber = column + 1;

      for (let value = 1; value <= 9; value++) {
        let strValue = String(value);

        if (
          this.checkRowPlacement(puzzle, rowLetter, columnNumber, strValue)
            .valid &&
          this.checkColPlacement(puzzle, rowLetter, columnNumber, strValue)
            .valid &&
          this.checkRegionPlacement(puzzle, rowLetter, columnNumber, strValue)
            .valid
        ) {
          let newPuzzle =
            puzzle.slice(0, emptyIndex) + strValue + puzzle.slice(emptyIndex + 1);
          let solved = solveRecursive(newPuzzle);
          if (solved) return solved;
        }
      }
      return false;
    };

    const solved = solveRecursive(puzzleString);
    return solved ? solved : { error: "Puzzle cannot be solved" };
  }
}

module.exports = SudokuSolver;
