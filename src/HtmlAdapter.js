/**
 * @fileOverview HtmlAdapter module definition
 */

var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * An adapter for the Player class that implements asking the user for moves through HTML.
   *
   * @class HtmlAdapter
   * @constructor
   */
  app.HtmlAdapter = function () {
  };

  /**
   * This asks the human for a move.
   * @param {array} board example: [0,0,0,0,0,0,0,0,0]
   * @param {integer} me    the side you are playing. 1 or 2.
   */
  app.HtmlAdapter.prototype.getMove = function (board, me) {
    if (board.length !== this.getNumberOfSquares()) throw new Error("invalid board");
    if (me !== 1 && me !== 2) throw new Error("invalid side");

    alert("This is the board: " + board);
    var move = prompt("Enter your move");
    console.log('Human chose ' + move);
    return move;
  };

  app.Player.prototype.getNumberOfSquares = function () {
    return 9;
  };

  app.Player.prototype.setNumberOfSquares = function (numberOfSquares) {
    if (Number.isInteger(numberOfSquares)) {
      this.numberOfSquares = numberOfSquares;
    } else {
      throw new Error("argument must be integer");
    }
  };

  /**
   * checks that the board is open for a move and returns the first move available.
   * @param {array} board
   */
  app.Player.prototype.confirmThereIsAMoveAvailable = function (board) {
    for (var i = 0; i < this.getNumberOfSquares(); i++) {
      if (board[i] === 0) {
        return i;
      }
    }
    throw new Error("there are no available squares to play");
  };

})(ticTacToe);
