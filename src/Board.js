var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * An adapter for the Player class that implements asking the user for moves through HTML.
   *
   * @class HtmlAdapter
   * @constructor
   */
  app.Board = function (options) {
    if (!options) {
      this.options = {};
    } else {
      this.options = options;
    }

    this.numberOfSquares = this.options.numberOfSquares || 9;
    this.confirmBoardSizeIsValidNumber(this.numberOfSquares);

    this.squareStatus = Array.apply(null, Array(this.numberOfSquares)).map(function() { return 0; });
  };

  /**
   * Getter for squares on board
   */
  app.Board.prototype.getStatus = function () {
    return this.squareStatus;
  };

  app.Board.prototype.getNumberOfSquares = function () {
    return this.numberOfSquares;
  };

  app.Board.prototype.confirmBoardSizeIsValidNumber = function (number) {
    if (!Number.isInteger(number)) {
      throw new Error("argument must be integer");
    }
    if (!Number.isInteger(Math.sqrt(number)) && number % 2 !== 0) {
      throw new Error("argument must be an odd square number.  9, 25, 49, etc.");
    }
  };

  app.Board.prototype.setMove = function (square) {
    if (this.isSquareEmpty(square)) {
      this.squareStatus[square] = this.findNextPlayer();
      return;
    }

    throw new Error("That is not a valid move")
  };

  app.Board.prototype.isSquareEmpty = function (square) {
    return (this.squareStatus[square] === 0);
  };

  app.Board.prototype.findNextPlayer = function () {
    return this.compareMovesToDetermineNextPlayer(this.countPlayersMoves(1), this.countPlayersMoves(2));
  };

  app.Board.prototype.countPlayersMoves = function (player) {
    var moveCount = 0;
    this.squareStatus.forEach(function (squareValue) {
      if (squareValue === player) moveCount++;
    });
    return moveCount;
  };

  app.Board.prototype.compareMovesToDetermineNextPlayer = function (playerOneMoves, playerTwoMoves) {
    if (playerOneMoves === playerTwoMoves) {
      return 1;
    }
    return 2;
  };

})(ticTacToe);
