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
    var firstAvailableMove = this.confirmThereIsAMoveAvailable(board);

    if (this.isFirstMove(board)) {
      console.log('I am choosing an open corner.');
      return this.findOpenCorner(board);
    }

    if (this.squaresPlayed(board) === 1) {
      if (this.cornerHasBeenPlayed(board)) {
        console.log('I am playing middle square.');
        return this.getMiddleSquare();
      }
    }

    if (this.squaresPlayed(board) === 2) {
      if (this.PlayedCornerThenPlayedMiddle(board)) {
        console.log('I am playing the opposite corner.')
        return this.oppositeCorner(board);
      }
    }

    if (this.squaresPlayed(board) === 3) {
      if (this.PlayedOppositeCornersAndMiddle(board)) {
        console.log('I am playing an edge that is not a corner.')
        return this.edgeNotCorner(board);
      }
    }

    var winningMove = this.findTwoInARowWithEmptyOption(board, me);
    if (winningMove !== false) {
      console.log('I found a winning move.');
      return winningMove;
    }

    var blockingMove = this.findTwoInARowWithEmptyOption(board, this.getEnemy(me));
    if (blockingMove !== false) {
      console.log('I am blocking a winning move from my opponent.');
      return blockingMove;
    }

    var addToSingleMove = this.findMoveIfSoloAndRestEmpty(board, me);
    if (addToSingleMove !== false) {
      console.log('I am making a move that will allow me to win next turn.');
      return addToSingleMove;
    }

    var blockSingleMove = this.findMoveIfSoloAndRestEmpty(board, this.getEnemy(me));
    if (blockSingleMove !== false) {
      console.log('I am blocking my opponent from making a move that would allow him to win in two moves.');
      return blockSingleMove;
    }

    console.log('I cannot think of a better move so I am making the first available move.');
    return firstAvailableMove;
  };

  app.AiPlayer.prototype.confirmThereIsAMoveAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return i;
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

    return false;
  }

  app.AiPlayer.prototype.findTwoInARowVerticallyWithEmptyOption = function (board, side) {
    for (var colNum = 0; colNum < this.getRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = this.mapVerticalColumnToSquare(colNum, colPosition);
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
        if (this.wouldBeWinningSpot(emptySpot, sideCount)) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findTwoInARowHorizontallyWithEmptyOption = function (board, side) {
    for (var colNum = 0; colNum < this.getRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapHorizontalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = this.mapHorizontalColumnToSquare(colNum, colPosition);
        }
        if (board[this.mapHorizontalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
        if (this.wouldBeWinningSpot(emptySpot, sideCount)) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findTwoInARowDiagonallyWithEmptyOption = function (board, side) {
    for (var colNum = 0; colNum < this.getDiagonalRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = this.mapDiagonalColumnToSquare(colNum, colPosition);
        }
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
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

  app.AiPlayer.prototype.getDiagonalRowCount = function () {
    return 2;
  }

  app.AiPlayer.prototype.mapVerticalColumnToSquare = function (columnNumber, columnPosition) {
    return columnNumber + (3 * columnPosition);
  }

  app.AiPlayer.prototype.mapHorizontalColumnToSquare = function (columnNumber, columnPosition) {
    return (3 * columnNumber) + columnPosition;
  }

  app.AiPlayer.prototype.mapDiagonalColumnToSquare = function (columnNumber, columnPosition) {
    return (columnNumber * 2) + ((4 - (2 * columnNumber)) * columnPosition);
  }

  app.AiPlayer.prototype.findMoveIfSoloAndRestEmpty = function (board, side) {
    var diagonally = this.findMoveIfSoloAndRestEmptyOnDiagonal(board, side);
    if (diagonally !== false) {
      return diagonally;
    }
    var vertically = this.findMoveIfSoloAndRestEmptyOnVertical(board, side);
    if (vertically !== false) {
      return vertically;
    }
    var horizontally = this.findMoveIfSoloAndRestEmptyOnHorizontal(board, side);
    if (horizontally !== false) {
      return horizontally;
    }

    return false;
  }

  app.AiPlayer.prototype.findMoveIfSoloAndRestEmptyOnDiagonal = function (board, side) {
    for (var colNum = 0; colNum < this.getDiagonalRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition)] === this.getEnemy(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapDiagonalColumnToSquare(colNum,0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapDiagonalColumnToSquare(colNum,emptySpot);
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findMoveIfSoloAndRestEmptyOnVertical = function (board, side) {
    for (var colNum = 0; colNum < this.getRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition)] === this.getEnemy(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapVerticalColumnToSquare(colNum,0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapVerticalColumnToSquare(colNum,emptySpot);
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.findMoveIfSoloAndRestEmptyOnHorizontal = function (board, side) {
    for (var colNum = 0; colNum < this.getRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < this.getRowCount(); colPosition++) {
        if (board[this.mapHorizontalColumnToSquare(colNum,colPosition)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapHorizontalColumnToSquare(colNum,colPosition)] === side) {
          sideCount++;
        }
        if (board[this.mapHorizontalColumnToSquare(colNum,colPosition)] === this.getEnemy(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapHorizontalColumnToSquare(colNum,0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapHorizontalColumnToSquare(colNum,emptySpot);
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.isSoloAndRestEmpty = function (sideCount, enemyCount) {
    return (sideCount === 1 && enemyCount === 0);
  }

  app.AiPlayer.prototype.squaresPlayed = function (board) {
    var count = board.length;
    var squaresPlayed = 0;
    for (i = 0; i < count; i++) {
      if (board[i] !== 0) {
        squaresPlayed++;
      }
    }
    return squaresPlayed;
  }

  app.AiPlayer.prototype.findOpenCorner = function (board) {
    if (board[0] === 0) { return 0; }
    if (board[2] === 0) { return 2; }
    if (board[6] === 0) { return 6; }
    if (board[8] === 0) { return 8; }
    return false;
  }

  app.AiPlayer.prototype.isFirstMove = function (board) {
    return (this.squaresPlayed(board) === 0);
  }

  app.AiPlayer.prototype.PlayedCornerThenPlayedMiddle = function (board) {
    if (this.cornerHasBeenPlayed(board) && this.middleHasBeenPlayed(board)) {
      return true;
    }
    return false;
  }

  app.AiPlayer.prototype.cornerHasBeenPlayed = function (board) {
    if (board[0] !== 0 || board[2] !== 0 || board[6] !== 0 || board[8] !== 0) {
      return true;
    }
    return false;
  }

  app.AiPlayer.prototype.middleHasBeenPlayed = function (board) {
    if (board[4]) {
      return true;
    }
    return false;
  }

  app.AiPlayer.prototype.oppositeCorner = function (board) {
    if (board[0] !== 0 && this.squareIsEmpty(board[8])) { return 8; }
    if (board[2] !== 0 && this.squareIsEmpty(board[6])) { return 6; }
    if (board[6] !== 0 && this.squareIsEmpty(board[2])) { return 2; }
    if (board[8] !== 0 && this.squareIsEmpty(board[0])) { return 0; }
    return false;
  }

  app.AiPlayer.prototype.squareIsEmpty = function (square) {
    return (square === 0) ? true : false;
  }

  app.AiPlayer.prototype.getMiddleSquare = function () {
    return 4;
  }

  app.AiPlayer.prototype.PlayedOppositeCornersAndMiddle = function (board) {
    if (this.opposingCornersPlayed(board) && this.middleHasBeenPlayed(board)) {
      return true;
    }
    return false;
  }

  app.AiPlayer.prototype.opposingCornersPlayed = function (board) {
    if ((board[0] !== 0 && board[8] !== 0) || (board[2] !== 0 && board[6] !== 0)) {
      return true;
    }
    return false;
  }

  app.AiPlayer.prototype.edgeNotCorner = function (board) {
    if (board[1] === 0) { return 1; }
    if (board[3] === 0) { return 3; }
    if (board[5] === 0) { return 5; }
    if (board[7] === 0) { return 7; }
    return false;
  }
})(ticTacToe);
