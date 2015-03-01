/**
 * @fileOverview AiPlayer module definition
 */

var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * A class that plays TicTacToe without user input
   *
   * @class AiPlayer
   * @constructor
   * @param {Object} options A set of options chosen by the instantiator of the class
   */
  app.AiPlayer = function (options) {
    if (!options) {
      this.options = {};
    } else {
      this.options = options;
    }
    this.name = this.options.name || "AI Player";
    this.numberOfSquares = this.options.numberOfSquares || 9;
  };

  /**
   * Returns the name of the AiPlayer instantiation
   *
   * @method getName
   * @returns this.name The name of the AiPlayer instantiation
   */
  app.AiPlayer.prototype.getName = function () {
    return this.name;
  };

  app.AiPlayer.prototype.setName = function (name) {
    this.name = name;
  };

  app.AiPlayer.prototype.getMove = function (board, me) {
    if (board.length !== this.getNumberOfSquares()) throw new Error("invalid board");
    if (me !== 1 && me !== 2) throw new Error("invalid side");

    return this.calculateMove(board, me);
  };

  app.AiPlayer.prototype.getNumberOfSquares = function () {
    return this.numberOfSquares;
  };

  app.AiPlayer.prototype.setNumberOfSquares = function (numberOfSquares) {
    if (Number.isInteger(numberOfSquares)) {
      this.numberOfSquares = numberOfSquares;
    } else {
      throw new Error("argument must be integer");
    }
  };

  app.AiPlayer.prototype.calculateMove = function (board, me) {
    var enemy = this.getEnemy(me);
    this.confirmThereIsAMoveAvailable(board);
    var winningMove = this.findTwoInARowWithEmptyOption(board, me);
    if (winningMove !== false) {
      return winningMove;
    }
    return false;
    throw new Error('could not decide on a move');
  };

  app.AiPlayer.prototype.confirmThereIsAMoveAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return board[i];
      }
    }
    throw new Error("there are no available squares to play");
  }

  app.AiPlayer.prototype.findTwoInARowWithEmptyOption = function (board, side) {
    var vertically = this.findTwoInARowVerticallyWithEmptyOption(board, side);
    if (vertically !== false) {
      return vertically;
    }
    var horizontally = this.findTwoInARowHorizontallyWithEmptyOption(board, side);
    if (horizontally !== false) {
      return horizontally;
    }
    var diagonally = this.findTwoInARowDiagonallyWithEmptyOption(board, side);
    if (diagonally !== false) {
      return diagonally;
    }

    // eventually return false if no move
    return 1;
  }

  app.AiPlayer.prototype.findTwoInARowVerticallyWithEmptyOption = function (board, side) {
    var verticals = [];
    var colCount;
    verticals = this.getVerticalColumns(board);
    var colCount = verticals.length;
    for (var colNum = 0; colNum < colCount; colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      var colSize = verticals[colNum].length;
      for (var colPosition = 0; colPosition < colSize; colPosition++) {
        if (verticals[colNum][colPosition] === 0) emptySpot = colNum + (3 * colPosition);
        if (verticals[colNum][colPosition] === side) sideCount++;

        if (this.wouldBeWinningSpot(emptySpot, sideCount)) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findTwoInARowHorizontallyWithEmptyOption = function (board, side) {
    var horizontals = [];
    var colCount;
    horizontals = this.getHorizontalColumns(board);
    var colCount = horizontals.length;
    for (var colNum = 0; colNum < colCount; colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      var colSize = horizontals[colNum].length;
      for (var colPosition = 0; colPosition < colSize; colPosition++) {
        if (horizontals[colNum][colPosition] === 0) emptySpot = (3 * colNum) + colPosition;
        if (horizontals[colNum][colPosition] === side) sideCount++;

        if (this.wouldBeWinningSpot(emptySpot, sideCount)) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findTwoInARowDiagonallyWithEmptyOption = function (board, side) {
    var diagonals = [];
    var colCount;
    diagonals = this.getDiagonalColumns(board);
    var colCount = diagonals.length;
    for (var colNum = 0; colNum < colCount; colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      var colSize = diagonals[colNum].length;
      for (var colPosition = 0; colPosition < colSize; colPosition++) {
        if (diagonals[colNum][colPosition] === 0) emptySpot = (colNum * 2) + ((4 - (2 * colNum)) * colPosition);
        if (diagonals[colNum][colPosition] === side) sideCount++;

        if (this.wouldBeWinningSpot(emptySpot, sideCount)) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.getEnemy = function (me) {
    return (me === 1) ? 2 : 1;
  }

  app.AiPlayer.prototype.wouldBeWinningSpot = function (thereIsAnEmptySquare, sameSideMarksInRowCount) {
    return (thereIsAnEmptySquare !== false && sameSideMarksInRowCount === (this.getRowCount() - 1));
  }

  app.AiPlayer.prototype.getRowCount = function () {
    return Math.sqrt(this.getNumberOfSquares());
  }

  app.AiPlayer.prototype.getVerticalColumns = function (board) {
    var array = [];
    array[0] = [board[0], board[3], board[6]];
    array[1] = [board[1], board[4], board[7]];
    array[2] = [board[2], board[5], board[8]];
    return array;
  }

  app.AiPlayer.prototype.getHorizontalColumns = function (board) {
    var array = [];
    array[0] = [board[0], board[1], board[2]];
    array[1] = [board[3], board[4], board[5]];
    array[2] = [board[6], board[7], board[8]];
    return array;
  }

  app.AiPlayer.prototype.getDiagonalColumns = function (board) {
    var array = [];
    array[0] = [board[0], board[4], board[8]];
    array[1] = [board[2], board[4], board[6]];
    return array;
  }

})(ticTacToe);
