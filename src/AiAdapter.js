var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * An adapter for the Player class that implements asking the user for moves through HTML.
   *
   * @class HtmlAdapter
   * @constructor
   */
  app.AiAdapter = function (player) {
  };

  /**
   * Getter for name
   */
  app.AiAdapter.prototype.getNumberOfSquares = function () {
    return 9;
  };

  /**
   * Setter for number of squares on the board. needs to live on the board object.
   * @param {integer} numberOfSquares number of squares on the board. probably
   * should be on the board object.
   */
  app.AiAdapter.prototype.setNumberOfSquares = function (numberOfSquares) {
    if (Number.isInteger(numberOfSquares)) {
      this.numberOfSquares = numberOfSquares;
    } else {
      throw new Error("argument must be integer");
    }
  };
  /**
   * This adapter calculates its move from an algorithm instead of asking a human.
   * @param {array} board
   * @param {integer} me
   */
  app.AiAdapter.prototype.getMove = function (board, me) {
    if (board.length !== this.getNumberOfSquares()) throw new Error("invalid board");
    if (me !== 1 && me !== 2) throw new Error("invalid side");

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
      if (this.playedOppositeCornersAndMiddle(board)) {
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

  /**
   * Determines if the board is legitimate and returns the first available move.
   * @param {array} board
   */
  app.AiAdapter.prototype.confirmThereIsAMoveAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return i;
      }
    }
    throw new Error("there are no available squares to play");
  }

  /**
   * This determines if there is a row with 2 same side moves and an empty move.
   * It determines if there is a winning move present on the board.
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findTwoInARowWithEmptyOption = function (board, side) {
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

  /**
   * This is a sub-method of findTwoInARowWithEmptyOption to find vertically.
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findTwoInARowVerticallyWithEmptyOption = function (board, side) {
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

  /**
   * This is a sub-method of findTwoInARowWithEmptyOption to find horizontally.
   * Could probably be refactored with vertical and diagonal.
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findTwoInARowHorizontallyWithEmptyOption = function (board, side) {
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

  /**
   * This is a sub-method of findTwoInARowWithEmptyOption to find diagonally.
   * Could probably be refactored into the other vertical and horizontal methods.
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findTwoInARowDiagonallyWithEmptyOption = function (board, side) {
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

  /**
   * This return the opponent's side.
   * @param {integer} me my side. 1 or 2.
   */
  app.AiAdapter.prototype.getEnemy = function (me) {
    return (me === 1) ? 2 : 1;
  }

  /**
   * This checks whether the move is a winning move.
   * @param {boolean} thereIsAnEmptySquare
   * @param {integer} sameSideMarksInRowCount number of similar side moves in this row/column/diagonal.
   */
  app.AiAdapter.prototype.wouldBeWinningSpot = function (thereIsAnEmptySquare, sameSideMarksInRowCount) {
    return (thereIsAnEmptySquare !== false && sameSideMarksInRowCount === (this.getRowCount() - 1));
  }

  /**
   * returns number of rows given number of squares.
   */
  app.AiAdapter.prototype.getRowCount = function () {
    return Math.sqrt(this.getNumberOfSquares());
  }

  /**
   * returns the number of rows that are diagonal. Could probably find this via an algorithm for any size board.
   * Although it should always be 2.
   */
  app.AiAdapter.prototype.getDiagonalRowCount = function () {
    return 2;
  }

  /**
   * Algorithm for determining the square number based on column and position.
   * @param {integer} columnNumber   left to right, 0,1,2.
   * @param {integer} columnPosition top to bottom, 0,1,2.
   */
  app.AiAdapter.prototype.mapVerticalColumnToSquare = function (columnNumber, columnPosition) {
    return columnNumber + (3 * columnPosition);
  }

  /**
   * Algorithm for determining the square number based on row and position.
   * @param {integer} columnNumber   top to bottom, 0,1,2.
   * @param {integer} columnPosition left to right, 0,1,2.
   */
  app.AiAdapter.prototype.mapHorizontalColumnToSquare = function (columnNumber, columnPosition) {
    return (3 * columnNumber) + columnPosition;
  }

  /**
   * Algorithm for determining the square number based on row and position.
   * @param {integer} columnNumber   top left to bottom right = 0. top right to bottom left = 1.
   * @param {integer} columnPosition from top to bottom, 0,1,2.
   */
  app.AiAdapter.prototype.mapDiagonalColumnToSquare = function (columnNumber, columnPosition) {
    return (columnNumber * 2) + ((4 - (2 * columnNumber)) * columnPosition);
  }

  /**
   * Determines if a row has a single move in it and the rest of the row is empty.
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmpty = function (board, side) {
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

  /**
   * Sub-method for diagonals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnDiagonal = function (board, side) {
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

  /**
   * Sub-method for verticals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnVertical = function (board, side) {
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

  /**
   * Sub-method for horizontals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnHorizontal = function (board, side) {
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

  /**
   * Determines if a row is a single move with the rest empty.
   * @param {[type]} sideCount  [description]
   * @param {[type]} enemyCount [description]
   */
  app.AiAdapter.prototype.isSoloAndRestEmpty = function (sideCount, enemyCount) {
    return (sideCount === 1 && enemyCount === 0);
  }

  /**
   * counts the number of moves.
   * @param {array} board
   */
  app.AiAdapter.prototype.squaresPlayed = function (board) {
    var count = board.length;
    var squaresPlayed = 0;
    for (i = 0; i < count; i++) {
      if (board[i] !== 0) {
        squaresPlayed++;
      }
    }
    return squaresPlayed;
  }

  /**
   * returns the first corner that has not been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.findOpenCorner = function (board) {
    if (board[0] === 0) { return 0; }
    if (board[2] === 0) { return 2; }
    if (board[6] === 0) { return 6; }
    if (board[8] === 0) { return 8; }
    return false;
  }

  /**
   * Determines whether the board has any moves on it yet.
   * @param {array} board [description]
   */
  app.AiAdapter.prototype.isFirstMove = function (board) {
    return (this.squaresPlayed(board) === 0);
  }

  /**
   * Determines if there is a corner move and a middle move. Used only if there squaresPlayed === 2.
   * @param {array} board
   */
  app.AiAdapter.prototype.PlayedCornerThenPlayedMiddle = function (board) {
    if (this.cornerHasBeenPlayed(board) && this.middleHasBeenPlayed(board)) {
      return true;
    }
    return false;
  }

  /**
   * Returns whether any corner has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.cornerHasBeenPlayed = function (board) {
    if (board[0] !== 0 || board[2] !== 0 || board[6] !== 0 || board[8] !== 0) {
      return true;
    }
    return false;
  }

  /**
   * returns whether the middle square has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.middleHasBeenPlayed = function (board) {
    if (board[4]) {
      return true;
    }
    return false;
  }

  /**
   * finds the first empty opposite corner of a corner that has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.oppositeCorner = function (board) {
    if (board[0] !== 0 && this.squareIsEmpty(board[8])) { return 8; }
    if (board[2] !== 0 && this.squareIsEmpty(board[6])) { return 6; }
    if (board[6] !== 0 && this.squareIsEmpty(board[2])) { return 2; }
    if (board[8] !== 0 && this.squareIsEmpty(board[0])) { return 0; }
    return false;
  }

  /**
   * Determines whether a square is empty.
   * @param {integer} square
   */
  app.AiAdapter.prototype.squareIsEmpty = function (square) {
    return (square === 0) ? true : false;
  }

  /**
   * returns the middle square of the board. Could be turned in to an algorithm based on size of board.
   */
  app.AiAdapter.prototype.getMiddleSquare = function () {
    return 4;
  }

  /**
   * Determines if the board has a middle square and two opposite corners played.
   * This is used when squaresPlayed === 3.
   * @param {array} board
   */
  app.AiAdapter.prototype.playedOppositeCornersAndMiddle = function (board) {
    if (this.opposingCornersPlayed(board) && this.middleHasBeenPlayed(board)) {
      return true;
    }
    return false;
  }

  /**
   * Helper method for playedOppositeCornersAndMiddle.
   * Returns whether two opposing corners have been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.opposingCornersPlayed = function (board) {
    if ((board[0] !== 0 && board[8] !== 0) || (board[2] !== 0 && board[6] !== 0)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the first available square that is not a corner but is on the outside.
   * @param {array} board
   */
  app.AiAdapter.prototype.edgeNotCorner = function (board) {
    if (board[1] === 0) { return 1; }
    if (board[3] === 0) { return 3; }
    if (board[5] === 0) { return 5; }
    if (board[7] === 0) { return 7; }
    return false;
  }


})(ticTacToe);
