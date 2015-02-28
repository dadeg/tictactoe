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
   * @default {}
   */
  this.player1 = player1 || {};

  /**
   * A reference to the player2 object instance
   *
   * @property player2
   * @type {Object}
   * @default {}
   */
  this.player2 = player2 || {};

  /**
   * An array representing the tic tac toe game board
   *
   * @property gameBoard
   * @type {Array}
   * @default [0,0,0,0,0,0,0,0,0]
   */
  this.gameBoard = [0,0,0,0,0,0,0,0,0];

  /**
   * Tracks whether the game is won by either player
   *
   * @property gameIsNotWon
   * @type {bool}
   * @default true
   */
  this.gameIsNotWon = true;

  this.init();
};

/**
 * Initializes the game engine
 *
 * @method init
 * @returns Game
 */
Game.prototype.init = function() {
  this.assignSides()
      .runGame(this.player1);

  return this;
};

/**
 * Assigns tic tac toe sides to the players
 *
 * @method assignSides
 * @returns Game
 * @chainable
 */
Game.prototype.assignSides = function() {
  this.player1.side = 1;
  this.player2.side = 2;

  return this;
};

/**
 * Recursively runs getMove methods on the players until
 * there is a winner
 *
 * @method runGame
 * @param {Object} currentPlayer The current player of the game
 */
Game.prototype.runGame = function(currentPlayer) {
  var move;
  var nextPlayer;

  if (currentPlayer === this.player1) {
    nextPlayer = this.player2;
  } else {
    nextPlayer = this.player1;
  }

  if (this.gameIsNotWon) {
    move = currentPlayer.getMove(this.gameBoard, currentPlayer.side);
    this.updateGameBoard(move, currentPlayer);
    this.checkForWin();
    this.runGame(nextPlayer);
  } else {
    this.publishWin();
  }
};

/**
 * Updates the game board with the current player move
 *
 * @method updateGameBoard
 * @param {int} move The index of the game board array where the move is made
 * @param {Object} currentPlayer The current player of the game
 * @chainable
 */
Game.prototype.updateGameBoard = function(move, currentPlayer) {
  this.gameBoard[move] = currentPlayer.side;

  return this;
};

/**
 * Checks the game board to see if the current player's move wins the game
 * or draws the game
 *
 * @method checkForWin
 * @chainable
 */
Game.prototype.checkForWin = function() {

  return this;
};

/**
 * Publishes to a PubSub object with winner information for use by other modules
 *
 * @method publishWin
 * @chainable
 */
Game.prototype.publishWin = function() {

  return this;
};