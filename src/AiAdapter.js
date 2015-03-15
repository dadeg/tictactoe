"use strict";
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
   * This adapter calculates its move from an algorithm instead of asking a human.
   * @param {array} board
   * @param {integer} me
   */
  app.AiAdapter.prototype.getMove = function (board, me) {
    if (me !== 1 && me !== 2) throw new Error("invalid side");

    var firstAvailableMove = this.confirmThereIsAMoveAvailable(board);

    if (this.isFirstMove(board)) {
      console.log('I am choosing an open corner.');
      return this.findOpenCorner(board);
    }

    if (this.squaresPlayed(board) === 1) {
      if (this.cornerHasBeenPlayed(board)) {
        console.log('I am playing middle square.');
        return board.getMiddleSquare();
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

    var blockingMove = this.findTwoInARowWithEmptyOption(board, this.getOpponent(me));
    if (blockingMove !== false) {
      console.log('I am blocking a winning move from my opponent.');
      return blockingMove;
    }

    var addToSingleMove = this.findMoveIfSoloAndRestEmpty(board, me);
    if (addToSingleMove !== false) {
      console.log('I am making a move that will allow me to win next turn.');
      return addToSingleMove;
    }

    var blockSingleMove = this.findMoveIfSoloAndRestEmpty(board, this.getOpponent(me));
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
    for (var i = 0; i < board.getNumberOfSquares(); i++) {
      if (board.isSquareEmpty(i)) {
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
    for (var colNum = 0; colNum < board.getRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapVerticalColumnToSquare(colNum,colPosition))) {
          emptySpot = board.mapVerticalColumnToSquare(colNum, colPosition);
        }
        if (board.isSquareEqual(board.mapVerticalColumnToSquare(colNum,colPosition), side)) {
          sideCount++;
        }
        if (this.wouldBeWinningSpot(emptySpot, sideCount, board)) {
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
    for (var colNum = 0; colNum < board.getRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapHorizontalColumnToSquare(colNum, colPosition))) {
          emptySpot = board.mapHorizontalColumnToSquare(colNum, colPosition);
        }
        if (board.isSquareEqual(board.mapHorizontalColumnToSquare(colNum, colPosition), side)) {
          sideCount++;
        }
        if (this.wouldBeWinningSpot(emptySpot, sideCount, board)) {
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
    for (var colNum = 0; colNum < board.getDiagonalRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapDiagonalColumnToSquare(colNum, colPosition))) {
          emptySpot = board.mapDiagonalColumnToSquare(colNum, colPosition);
        }
        if (board.isSquareEqual(board.mapDiagonalColumnToSquare(colNum,colPosition), side)) {
          sideCount++;
        }
        if (this.wouldBeWinningSpot(emptySpot, sideCount, board)) {
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
  app.AiAdapter.prototype.getOpponent = function (me) {
    return (me === 1) ? 2 : 1;
  };

  /**
   * This checks whether the move is a winning move.
   * @param {boolean} thereIsAnEmptySquare
   * @param {integer} sameSideMarksInRowCount number of similar side moves in this row/column/diagonal.
   */
  app.AiAdapter.prototype.wouldBeWinningSpot = function (thereIsAnEmptySquare, sameSideMarksInRowCount, board) {
    return (thereIsAnEmptySquare !== false && sameSideMarksInRowCount === (board.getRowCount() - 1));
  };

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
  };

  /**
   * Sub-method for diagonals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnDiagonal = function (board, side) {
    for (var colNum = 0; colNum < board.getDiagonalRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapDiagonalColumnToSquare(colNum, colPosition))) {
          emptySpot = colPosition;
        }
        if (board.isSquareEqual(board.mapDiagonalColumnToSquare(colNum, colPosition), side)) {
          sideCount++;
        }
        if (board.isSquareEqual(board.mapDiagonalColumnToSquare(colNum, colPosition), this.getOpponent(side))) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return board.mapDiagonalColumnToSquare(colNum, 0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return board.mapDiagonalColumnToSquare(colNum, emptySpot);
        }
      }
    }
    return false;
  };

  /**
   * Sub-method for verticals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnVertical = function (board, side) {
    for (var colNum = 0; colNum < board.getRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapVerticalColumnToSquare(colNum,colPosition))) {
          emptySpot = colPosition;
        }
        if (board.isSquareEqual(board.mapVerticalColumnToSquare(colNum,colPosition), side)) {
          sideCount++;
        }
        if (board.isSquareEqual(board.mapVerticalColumnToSquare(colNum,colPosition), this.getOpponent(side))) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return board.mapVerticalColumnToSquare(colNum, 0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return board.mapVerticalColumnToSquare(colNum, emptySpot);
        }
      }
    }
    return false;
  };

  /**
   * Sub-method for horizontals for findMoveIfSoloAndRestEmpty
   * @param {array} board
   * @param {integer} side
   */
  app.AiAdapter.prototype.findMoveIfSoloAndRestEmptyOnHorizontal = function (board, side) {
    for (var colNum = 0; colNum < board.getRowCount(); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < board.getRowCount(); colPosition++) {
        if (board.isSquareEmpty(board.mapHorizontalColumnToSquare(colNum, colPosition))) {
          emptySpot = colPosition;
        }
        if (board.isSquareEqual(board.mapHorizontalColumnToSquare(colNum, colPosition), side)) {
          sideCount++;
        }
        if (board.isSquareEqual(board.mapHorizontalColumnToSquare(colNum, colPosition), this.getOpponent(side))) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return board.mapHorizontalColumnToSquare(colNum, 0);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return board.mapHorizontalColumnToSquare(colNum, emptySpot);
        }
      }
    }
    return false;
  };

  /**
   * Determines if a row is a single move with the rest empty.
   * @param {[type]} sideCount  [description]
   * @param {[type]} enemyCount [description]
   */
  app.AiAdapter.prototype.isSoloAndRestEmpty = function (sideCount, enemyCount) {
    return (sideCount === 1 && enemyCount === 0);
  };

  /**
   * counts the number of moves.
   * @param {array} board
   */
  app.AiAdapter.prototype.squaresPlayed = function (board) {
    var count = board.getNumberOfSquares();
    var squaresPlayed = 0;
    var i;
    for (i = 0; i < count; i++) {
      if (!board.isSquareEmpty(i)) {
        squaresPlayed++;
      }
    }
    return squaresPlayed;
  };

  /**
   * returns the first corner that has not been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.findOpenCorner = function (board) {
    if (board.isSquareEmpty(0)) { return 0; }
    if (board.isSquareEmpty(2)) { return 2; }
    if (board.isSquareEmpty(6)) { return 6; }
    if (board.isSquareEmpty(8)) { return 8; }
    return false;
  };

  /**
   * Determines whether the board has any moves on it yet.
   * @param {array} board [description]
   */
  app.AiAdapter.prototype.isFirstMove = function (board) {
    return (this.squaresPlayed(board) === 0);
  };

  /**
   * Determines if there is a corner move and a middle move. Used only if there squaresPlayed === 2.
   * @param {array} board
   */
  app.AiAdapter.prototype.PlayedCornerThenPlayedMiddle = function (board) {
    return (this.cornerHasBeenPlayed(board) && board.middleHasBeenPlayed());
  };

  /**
   * Returns whether any corner has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.cornerHasBeenPlayed = function (board) {
    return (!board.isSquareEmpty(0)
         || !board.isSquareEmpty(2)
         || !board.isSquareEmpty(6)
         || !board.isSquareEmpty(8));
  };

  /**
   * finds the first empty opposite corner of a corner that has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.oppositeCorner = function (board) {
    if (!board.isSquareEmpty(0) && board.isSquareEmpty(8)) { return 8; }
    if (!board.isSquareEmpty(2) && board.isSquareEmpty(6)) { return 6; }
    if (!board.isSquareEmpty(6) && board.isSquareEmpty(2)) { return 2; }
    if (!board.isSquareEmpty(8) && board.isSquareEmpty(0)) { return 0; }
    return false;
  };

  /**
   * Determines if the board has a middle square and two opposite corners played.
   * This is used when squaresPlayed === 3.
   * @param {array} board
   */
  app.AiAdapter.prototype.playedOppositeCornersAndMiddle = function (board) {
    if (this.opposingCornersPlayed(board) && board.middleHasBeenPlayed()) {
      return true;
    }
    return false;
  };

  /**
   * Helper method for playedOppositeCornersAndMiddle.
   * Returns whether two opposing corners have been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.opposingCornersPlayed = function (board) {
    return ((!board.isSquareEmpty(0) && !board.isSquareEmpty(8))
         || (!board.isSquareEmpty(2) && !board.isSquareEmpty(6)));
  };

  /**
   * Returns the first available square that is not a corner but is on the outside.
   * @param {array} board
   */
  app.AiAdapter.prototype.edgeNotCorner = function (board) {
    if (board.isSquareEmpty(1)) { return 1; }
    if (board.isSquareEmpty(3)) { return 3; }
    if (board.isSquareEmpty(5)) { return 5; }
    if (board.isSquareEmpty(7)) { return 7; }
    return false;
  };


})(ticTacToe);
