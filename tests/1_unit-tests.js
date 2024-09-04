const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
  const solver = new SudokuSolver();

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.deepEqual(solver.validate(puzzleString), { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x';
    assert.deepEqual(solver.validate(puzzleString), {
      error: 'Invalid characters in puzzle',
    });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    assert.deepEqual(solver.validate(puzzleString), {
      error: 'Expected puzzle to be 81 characters long',
    });
  });

  test('Logic handles a valid row placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 1, '1'));
  });

  test('Logic handles a valid column placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkColPlacement(puzzleString, 0, 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkColPlacement(puzzleString, 0, 1, '6'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 1, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 1, '2'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    assert.deepEqual(solver.solve(puzzleString), { solution });
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x';
    assert.deepEqual(solver.solve(puzzleString), {
      error: 'Invalid characters in puzzle',
    });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      assert.deepEqual(solver.solve(puzzle), { solution });
    });
  });
});