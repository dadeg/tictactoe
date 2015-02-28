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
    this.name = options.name || "AI Player";
  };

  /**
   * Returns the name of the AiPlayer instantiation
   *
   * @method getName
   * @returns this.name The name of the AiPlayer instantiation
   */
  app.AiPlayer.prototype.getName = function() {
    return this.name;
  };

})(ticTacToe);
