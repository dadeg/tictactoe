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
    // stub to make the Ai always return a move...
    var square = this.isSquareAvailable(board);
    if (square !== false) return square;
    // end stub. remove when coding commences.
    this.isSquareAvailable(board);
    var twoInARow = this.findTwoInARowWithEmptyOption(board, me);
    if (twoInARow !== false) return twoInARow;
    return false;
    throw new Error('could not decide on a move');
  };

  app.AiPlayer.prototype.isSquareAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return board[i];
      }
    }
    throw new Error("there are no available squares to play");
  }

  app.AiPlayer.prototype.findTwoInARowWithEmptyOption = function (board, side) {
    var vertically = this.findTwoInARowVerticallyWithEmptyOption(board, side);
    if (vertically !== false) return vertically;

    return 1;
  }

  app.AiPlayer.prototype.findTwoInARowVerticallyWithEmptyOption = function (board, side) {
    var verticals = [];

    verticals[0] = [board[0], board[3], board[6]];
    verticals[1] = [board[1], board[4], board[7]];
    verticals[2] = [board[2], board[5], board[8]];
    var count = verticals.length;
    for (var i = 0; i < verticals.length; i++) {
      var emptySpot = false;
      var sideCount = 0;
      var count2 = verticals[i].length;
      for (var k = 0; k < count2; k++) {
        if (verticals[i][k] === 0) emptySpot = i + (3 * k);
        if (verticals[i][k] === side) sideCount++;

        if (emptySpot !== false && sideCount === 2) {
          return emptySpot;
        }
      }
    }
    return false;
  }

  app.AiPlayer.prototype.getEnemy = function (me) {
    return (me === 1) ? 2 : 1;
  }

})(ticTacToe);
