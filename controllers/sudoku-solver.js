class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81)
      return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9\.]/.test(puzzleString))
      return { error: 'Invalid characters in puzzle' };
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    for (let r = 0; r < 9; r++) {
      if (grid[r][column] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[regionRowStart + r][regionColStart + c] === value)
          return false;
      }
    }
    return true;
  }

  convertToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 81; i += 9) {
      grid.push(puzzleString.slice(i, i + 9).split(''));
    }
    return grid;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (!validateResult.valid) return validateResult;

    const grid = this.convertToGrid(puzzleString);
    if (this.solveGrid(grid)) {
      return { solution: grid.flat().join('') };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }

  solveGrid(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let value = 1; value <= 9; value++) {
            const char = value.toString();
            if (
              this.checkRowPlacement(grid.flat().join(''), row, col, char) &&
              this.checkColPlacement(grid.flat().join(''), row, col, char) &&
              this.checkRegionPlacement(grid.flat().join(''), row, col, char)
            ) {
              grid[row][col] = char;
              if (this.solveGrid(grid)) return true;
              grid[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;