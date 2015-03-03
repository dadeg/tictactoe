/**
 * @fileOverview Player module definition
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

  app.HtmlAdapter.prototype.getMove = function (board, me) {
    alert("This is the board: " + board);
    var move = prompt("Enter your move");
    console.log('Human chose ' + move);
    return move;
  };

})(ticTacToe);
