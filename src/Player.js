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
    this.name = this.options.name || "Player";
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

  /**
   * This is what the Game object will call in order to get the next move from this player.
   * This uses the adapter to ask for a move. The adapter could be human-based, or AI.
   * @param {array} board example: [0,0,0,0,0,1,0,2,0]
   * @param {integer} me    1 or 2. your side.
   */
  app.Player.prototype.getMove = function (board, me) {
    return this.adapter.getMove(board, me);
  };



})(ticTacToe);
