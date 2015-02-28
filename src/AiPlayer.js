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

  app.AiPlayer.prototype.getMove = function (board, side) {
    if (board.length !== this.getNumberOfSquares()) throw new Error("invalid board");
    if (side !== 1 && side !== 2) throw new Error("invalid side");

    return this.calculateMove(board, side);
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

  app.AiPlayer.prototype.calculateMove = function (board, side) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return i;
      }
    }
  };

})(ticTacToe);
