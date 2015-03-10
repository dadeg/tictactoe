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
   * Getter for name
   */
  app.AiAdapter.prototype.getNumberOfSquares = function (board) {
    return board.length;
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
        return this.getMiddleSquare(board);
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
    for (var i = 0; i < this.getNumberOfSquares(board); i++) {
      if (this.isSquareEmpty(i, board)) {
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
    for (var colNum = 0; colNum < this.getRowCount(board); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition, board)] === 0) {
          emptySpot = this.mapVerticalColumnToSquare(colNum, colPosition, board);
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition, board)] === side) {
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
    for (var colNum = 0; colNum < this.getRowCount(board); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapHorizontalColumnToSquare(colNum, colPosition, board)] === 0) {
          emptySpot = this.mapHorizontalColumnToSquare(colNum, colPosition, board);
        }
        if (board[this.mapHorizontalColumnToSquare(colNum, colPosition, board)] === side) {
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
    for (var colNum = 0; colNum < this.getDiagonalRowCount(); colNum++) {
      var emptySpot = false;
      var sideCount = 0;
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapDiagonalColumnToSquare(colNum, colPosition, board)] === 0) {
          emptySpot = this.mapDiagonalColumnToSquare(colNum, colPosition, board);
        }
        if (board[this.mapDiagonalColumnToSquare(colNum,colPosition, board)] === side) {
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
  }

  /**
   * This checks whether the move is a winning move.
   * @param {boolean} thereIsAnEmptySquare
   * @param {integer} sameSideMarksInRowCount number of similar side moves in this row/column/diagonal.
   */
  app.AiAdapter.prototype.wouldBeWinningSpot = function (thereIsAnEmptySquare, sameSideMarksInRowCount, board) {
    return (thereIsAnEmptySquare !== false && sameSideMarksInRowCount === (this.getRowCount(board) - 1));
  }

  /**
   * returns number of rows given number of squares.
   */
  app.AiAdapter.prototype.getRowCount = function (board) {
    return Math.sqrt(this.getNumberOfSquares(board));
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
  app.AiAdapter.prototype.mapVerticalColumnToSquare = function (columnNumber, columnPosition, board) {
    return columnNumber + (this.getRowCount(board) * columnPosition);
  }

  /**
   * Algorithm for determining the square number based on row and position.
   * @param {integer} columnNumber   top to bottom, 0,1,2.
   * @param {integer} columnPosition left to right, 0,1,2.
   */
  app.AiAdapter.prototype.mapHorizontalColumnToSquare = function (columnNumber, columnPosition, board) {
    return (this.getRowCount(board) * columnNumber) + columnPosition;
  }

  /**
   * Algorithm for determining the square number based on row and position.
   * 3x3
   * 0,4,8. x = r*4 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 2,4,6. x = (r+1)*2 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * 5x5
   * 0,6,12,18,24. x = r*6 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 4,8,12,16,20. x = (r+1)*4 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * 7x7
   * 0,8,16,24,32,40,48.  x = r*8 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 6,12,18,24,30,36,42. x = (r+1)*6 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * @param {integer} columnNumber   top left to bottom right = 0. top right to bottom left = 1.
   * @param {integer} columnPosition from top to bottom, 0,1,2.
   */
  app.AiAdapter.prototype.mapDiagonalColumnToSquare = function (columnNumber, positionInColumn, board) {
    return (positionInColumn + columnNumber) * (this.getRowCount(board)+1-(columnNumber * 2));
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
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapDiagonalColumnToSquare(colNum, colPosition, board)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapDiagonalColumnToSquare(colNum, colPosition, board)] === side) {
          sideCount++;
        }
        if (board[this.mapDiagonalColumnToSquare(colNum, colPosition, board)] === this.getOpponent(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapDiagonalColumnToSquare(colNum, 0, board);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapDiagonalColumnToSquare(colNum, emptySpot, board);
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
    for (var colNum = 0; colNum < this.getRowCount(board); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition, board)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition, board)] === side) {
          sideCount++;
        }
        if (board[this.mapVerticalColumnToSquare(colNum,colPosition, board)] === this.getOpponent(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapVerticalColumnToSquare(colNum, 0, board);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapVerticalColumnToSquare(colNum, emptySpot, board);
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
    for (var colNum = 0; colNum < this.getRowCount(board); colNum++) {

      var sideCount = 0;
      var oppositeSideCount = 0;
      var emptySpot = false;
      for (var colPosition = 0; colPosition < this.getRowCount(board); colPosition++) {
        if (board[this.mapHorizontalColumnToSquare(colNum, colPosition, board)] === 0) {
          emptySpot = colPosition;
        }
        if (board[this.mapHorizontalColumnToSquare(colNum, colPosition, board)] === side) {
          sideCount++;
        }
        if (board[this.mapHorizontalColumnToSquare(colNum, colPosition, board)] === this.getOpponent(side)) {
          oppositeSideCount++;
        }
      }

      if (this.isSoloAndRestEmpty(sideCount, oppositeSideCount)) {
        if (emptySpot === 1) {
          // this means the last empty spot was the middle one, which means
          // since there is only 1 mark in this row, 0 must be the opposite
          // since the mark is in 2 and opposite is preferred.
          return this.mapHorizontalColumnToSquare(colNum, 0, board);
        } else {
          // either it is 0 or 2, both of which are fine because it is a corner.

          return this.mapHorizontalColumnToSquare(colNum, emptySpot, board);
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
    var count = this.getNumberOfSquares(board);
    var squaresPlayed = 0;
    var i;
    for (i = 0; i < count; i++) {
      if (!this.isSquareEmpty(i, board)) {
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
    if (this.isSquareEmpty(0, board)) { return 0; }
    if (this.isSquareEmpty(2, board)) { return 2; }
    if (this.isSquareEmpty(6, board)) { return 6; }
    if (this.isSquareEmpty(8, board)) { return 8; }
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
    return (this.cornerHasBeenPlayed(board) && this.middleHasBeenPlayed(board));
  }

  /**
   * Returns whether any corner has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.cornerHasBeenPlayed = function (board) {
    return (!this.isSquareEmpty(0, board)
         || !this.isSquareEmpty(2, board)
         || !this.isSquareEmpty(6, board)
         || !this.isSquareEmpty(8, board));
  }

  /**
   * returns whether the middle square has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.middleHasBeenPlayed = function (board) {
    return !this.isSquareEmpty(this.getMiddleSquare(board), board);
  }

  /**
   * finds the first empty opposite corner of a corner that has been played.
   * @param {array} board
   */
  app.AiAdapter.prototype.oppositeCorner = function (board) {
    if (!this.isSquareEmpty(0, board) && this.isSquareEmpty(8, board)) { return 8; }
    if (!this.isSquareEmpty(2, board) && this.isSquareEmpty(6, board)) { return 6; }
    if (!this.isSquareEmpty(6, board) && this.isSquareEmpty(2, board)) { return 2; }
    if (!this.isSquareEmpty(8, board) && this.isSquareEmpty(0, board)) { return 0; }
    return false;
  }

  /**
   * Determines whether a square is empty.
   * @param {integer} square
   */
  app.AiAdapter.prototype.isSquareEmpty = function (square, board) {
    return (board[square] === 0);
  }

  /**
   * returns the middle square of the board. Could be turned in to an algorithm based on size of board.
   */
  app.AiAdapter.prototype.getMiddleSquare = function (board) {
    return (board.length - 1) / 2;
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
    return ((!this.isSquareEmpty(0, board) && !this.isSquareEmpty(8, board))
         || (!this.isSquareEmpty(2, board) && !this.isSquareEmpty(6, board)));
  }

  /**
   * Returns the first available square that is not a corner but is on the outside.
   * @param {array} board
   */
  app.AiAdapter.prototype.edgeNotCorner = function (board) {
    if (this.isSquareEmpty(1, board)) { return 1; }
    if (this.isSquareEmpty(3, board)) { return 3; }
    if (this.isSquareEmpty(5, board)) { return 5; }
    if (this.isSquareEmpty(7, board)) { return 7; }
    return false;
  }


})(ticTacToe);
