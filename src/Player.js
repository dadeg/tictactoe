/**
 * @fileOverview Player module definition
 */

var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * A class that plays TicTacToe and asks for user input.
   *
   * @class Player
   * @constructor
   * @param {Object} options A set of options chosen by the instantiator of the class
   */
  app.Player = function (options) {
    if (!options) {
      this.options = {};
    } else {
      this.options = options;
    }
    this.name = this.options.name || "AI Player";
    this.numberOfSquares = this.options.numberOfSquares || 9;
    this.adapter = this.options.adapter || new app.HtmlAdapter();
  };

  /**
   * Returns the name of the Player instantiation
   *
   * @method getName
   * @returns this.name The name of the Player instantiation
   */
  app.Player.prototype.getName = function () {
    return this.name;
  };

  app.Player.prototype.setName = function (name) {
    this.name = name;
  };

  app.Player.prototype.getMove = function (board, me) {
    if (board.length !== this.getNumberOfSquares()) throw new Error("invalid board");
    if (me !== 1 && me !== 2) throw new Error("invalid side");
    this.confirmThereIsAMoveAvailable(board);

    return this.askHumanForMove(board, me);
  };

  app.Player.prototype.askHumanForMove = function (board, me) {
    return this.adapter.getMove(board, me);
  };

  app.Player.prototype.getNumberOfSquares = function () {
    return this.numberOfSquares;
  };

  app.Player.prototype.setNumberOfSquares = function (numberOfSquares) {
    if (Number.isInteger(numberOfSquares)) {
      this.numberOfSquares = numberOfSquares;
    } else {
      throw new Error("argument must be integer");
    }
  };

  app.Player.prototype.confirmThereIsAMoveAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return i;
      }
    }
    throw new Error("there are no available squares to play");
  }

})(ticTacToe);
