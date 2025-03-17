class SudokuSolver {

  validate(puzzleString) {
    let regex = /^[1-9.]+$/;
    if(!puzzleString) return { error: 'Required field missing' };
    if(!regex.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if(puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' }
    return true;
  }

  //check if value can be place in row
  checkRowPlacement(puzzleString, row, column, value) {
    let boardPuzzleStrDict = {};

    for (let i = 0; i < 81; i++){
      let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
      let columnNum = (i % 9) + 1;
      boardPuzzleStrDict[rowLetter + columnNum] = i;
    }
    const puzStrIndex = boardPuzzleStrDict[row + column];
    if (puzzleString[puzStrIndex] == value) return { valid: true };
    //check if value exists in sunstring
    let subStrStartIndex = row == 'A' ? 0 : row == 'B' ? 9 : row == 'C' ? 18 : row == 'D' ? 27 : row == 'E' ? 36 : row == 'F' ? 45 : row == 'G' ? 54 : row == 'H' ? 63 : row == 'I' ? 72 : null;
    if (puzzleString.slice(subStrStartIndex, subStrStartIndex + 9).includes(value)) return {"valid": false, "conflict": ["row"]};
    return true; 
  }

  //check if value can be placed in column
  checkColPlacement(puzzleString, row, column, value) {
    let subStrStartIndex = column - 1;
    let c = []
    for (let i = subStrStartIndex; i < 81; i+=9){
      if(puzzleString[i] == value){
        return { "valid": false, "conflict": [ "column" ] }
      }
    }
    return true;
  }

  //check if value can be placed in region
  checkRegionPlacement(puzzleString, row, column, value) {
    let rowStartIndex = Math.floor((row.charCodeAt() - 65) / 3) * 3;
    const colStartIndex = Math.floor((column - 1) / 3) * 3;
    for (let i = rowStartIndex; i < rowStartIndex + 3; i++){
      for (let j = colStartIndex; j < colStartIndex + 3; j++){
        if (puzzleString[i * 9 + j] == value) return { "valid": false, "conflict": [ "region" ] }
      }
    };
    return true;
  }

  validateApiCheck(puzzleString, coordinate, value){
    let coordArray = [];
    let regex = /^[1-9]$/;
    let regex2 = /^[1-9.]+$/;

    if(!puzzleString || !value || !coordinate) return { error: 'Required field(s) missing' };
    if(!regex2.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if(puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' }
    if (!regex.test(value)) return { error: 'Invalid value' }
    
    for (let i = 0; i < 81; i++){
      let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
      let columnNum = (i % 9) + 1;
      coordArray.push(rowLetter + columnNum);
    }
    if (!coordArray.includes(coordinate)) return { error: 'Invalid coordinate'}
    return true;
  }

  //solve the entire sudoku
  solve(puzzleString) {
    return ''
  }
}

module.exports = SudokuSolver;