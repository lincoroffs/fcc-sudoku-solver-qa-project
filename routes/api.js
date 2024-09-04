'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

module.exports = function (app) {
  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validationResult = solver.validate(puzzle);
    if (!validationResult.valid) {
      return res.json(validationResult);
    }

    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate.charCodeAt(0) - 65; // Convert 'A'-'I' to 0-8
    const column = parseInt(coordinate[1]) - 1; // Convert '1'-'9' to 0-8

    const grid = solver.convertToGrid(puzzle);
    if (grid[row][column] === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, column, value)) {
      conflicts.push('row');
    }
    if (!solver.checkColPlacement(puzzle, row, column, value)) {
      conflicts.push('column');
    }
    if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
      conflicts.push('region');
    }

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    const validationResult = solver.validate(puzzle);
    if (!validationResult.valid) {
      return res.json(validationResult);
    }

    const solutionResult = solver.solve(puzzle);
    return res.json(solutionResult);
  });
};