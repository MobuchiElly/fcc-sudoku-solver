class SudokuSolver {

  validate(puzzleString) {
    let regex = /^[1-9.]+$/;
    if (!puzzleString) return { error: 'Required field missing' };
    if (!regex.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let boardPuzzleStrDict = {};

    for (let i = 0; i < 81; i++) {
      let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
      let columnNum = (i % 9) + 1;
      boardPuzzleStrDict[rowLetter + columnNum] = i;
    }

    const puzStrIndex = boardPuzzleStrDict[row + column];
    if (puzzleString[puzStrIndex] === value) return { valid: true };

    let rowStartIndex = (row.charCodeAt(0) - 'A'.charCodeAt(0)) * 9;
    let rowSubstring = puzzleString.slice(rowStartIndex, rowStartIndex + 9);

    if (rowSubstring.includes(value)) return { valid: false, conflict: ["row"] };

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
    let rowStartIndex = Math.floor((row.charCodeAt(0) - 'A'.charCodeAt(0)) / 3) * 3;
    let colStartIndex = Math.floor((column - 1) / 3) * 3;

    for (let i = rowStartIndex; i < rowStartIndex + 3; i++) {
      for (let j = colStartIndex; j < colStartIndex + 3; j++) {
        if (puzzleString[i * 9 + j] === value) return { valid: false, conflict: ["region"] };
      }
    }
    return { valid: true };
  }

  validateApiCheck(puzzleString, coordinate, value) {
    let coordArray = [];
    let regex = /^[1-9]$/;
    let regex2 = /^[1-9.]+$/;

    if (!puzzleString || !value || !coordinate) return { error: 'Required field(s) missing' };
    if (!regex2.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (!regex.test(value.trim())) return { error: 'Invalid value' };

    for (let i = 0; i < 81; i++) {
      let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
      let columnNum = (i % 9) + 1;
      coordArray.push(rowLetter + columnNum);
    }
    
    if (!coordArray.includes(coordinate.trim())) return { error: 'Invalid coordinate' };
    return true;
  }

  solve(puzzleString) {
    let checkRowPlacement = this.checkRowPlacement;
    let checkColPlacement = this.checkColPlacement;
    let checkRegionPlacement = this.checkRegionPlacement;

    function solveRecursive(puzzle) {
      let emptyIndex = puzzle.indexOf(".");
      if (emptyIndex === -1) return puzzle;

      let row = Math.floor(emptyIndex / 9);
      let column = emptyIndex % 9;
      let rowLetter = String.fromCharCode(65 + row);
      let columnNumber = column + 1;

      for (let value = 1; value <= 9; value++) {
        if (
          checkRowPlacement(puzzle, rowLetter, columnNumber, value).valid &&
          checkColPlacement(puzzle, rowLetter, columnNumber, value).valid &&
          checkRegionPlacement(puzzle, rowLetter, columnNumber, value).valid
        ) {
          let newPuzzle = puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);
          let solved = solveRecursive(newPuzzle);
          if (solved) return solved;
        }
      }
      return false;
    }

    const solved = solveRecursive(puzzleString);
    return solved ? solved : { error: 'Puzzle cannot be solved' };
  }
}

module.exports = SudokuSolver;
