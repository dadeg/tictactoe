/**
 * @fileOverview Game module definition
 */

/**
 * A game engine for tic tac toe
 *
 * @class Game
 * @constructor
 * @param {Object} player1
 * @param {Object} player2
 */
var Game = function(player1, player2) {
  /**
   * A reference to the player1 object instance
   *
   * @property player1
   * @type {Object}
   * @default null
   */
  this.player1 = player1;

  /**
   * A reference to the player2 object instance
   *
   * @property player2
   * @type {Object}
   * @default null
   */
  this.player2 = player2;

  /**
   * An array representing the tic tac toe game board
   *
   * @property gameBoard
   * @type {Array}
   * @default [null,null,null,null,null,null,null,null,null]
   */
  this.gameBoard = [
                    null, null, null,
                    null, null, null,
                    null, null, null
                   ];

  this.init();
};

/**
 * Initializes the game engine
 *
 * @method init
 * @returns Game
 */
Game.prototype.init = function() {

  return this;
};