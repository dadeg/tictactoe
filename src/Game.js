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
   * @default undefined
   */
  this.player1 = player1 || {};

  /**
   * A reference to the player2 object instance
   *
   * @property player2
   * @type {Object}
   * @default undefined
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
   * @property gameIsWon
   * @type {Boolean}
   * @default true
   */
  this.gameIsWon = false;

  /**
   * Tracks whether the game is a draw
   *
   * @property gameIsDrawn
   * @type {Boolean}
   * @default true
   */
  this.gameIsDrawn = false;

  /**
   * A reference to the PubSub object instance
   *
   * @property pubSub
   * @type {Object}
   * @default undefined
   */
  this.pubSub = new PubSub() || {};

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
  this.player1.setSide(1);
  this.player2.side = 2;
  this.player2.setSide(2);

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

  if (!this.gameIsWon && !this.gameIsDrawn) {
    move = currentPlayer.getMove(this.gameBoard, currentPlayer.side);
    this.updateGameBoard(move, currentPlayer);
    this.checkForWin();
    this.checkForDraw();
    this.runGame(nextPlayer);
  } else if (this.gameIsWon){
    this.publishWin(currentPlayer.side);
  } else if (this.gameIsDrawn){
    this.publishDraw();
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

  this.pubSub.publish('gameUpdate', {
    gameBoard: this.gameBoard
  });

  return this;
};

/**
 * Checks the game board to see if the current player's move wins the game
 *
 * @method checkForWin
 * @chainable
 */
Game.prototype.checkForWin = function() {
  switch(true) {
    case this.gameBoard[0] === this.gameBoard[1] && this.gameBoard[1] === this.gameBoard[2]:
    case this.gameBoard[3] === this.gameBoard[4] && this.gameBoard[4] === this.gameBoard[5]:
    case this.gameBoard[6] === this.gameBoard[7] && this.gameBoard[7] === this.gameBoard[8]:
    case this.gameBoard[0] === this.gameBoard[3] && this.gameBoard[3] === this.gameBoard[6]:
    case this.gameBoard[1] === this.gameBoard[4] && this.gameBoard[4] === this.gameBoard[7]:
    case this.gameBoard[2] === this.gameBoard[5] && this.gameBoard[5] === this.gameBoard[8]:
    case this.gameBoard[0] === this.gameBoard[4] && this.gameBoard[4] === this.gameBoard[8]:
    case this.gameBoard[2] === this.gameBoard[4] && this.gameBoard[4] === this.gameBoard[6]:
      this.gameIsWon = true;
      break;
  }

  return this;
};

/**
 * Checks the game board to see if the current player's move draws the game
 *
 * @method checkForDraw
 * @chainable
 */
Game.prototype.checkForDraw = function() {
  if (this.gameBoard.indexOf(0) < 0) {
    this.gameIsDrawn = true;
  }
  return this;
};

/**
 * Publishes to a PubSub object with winner information for use by other modules
 *
 * @method publishWin
 * @param {Int} winningSide The winning side
 * @chainable
 */
Game.prototype.publishWin = function(winningSide) {
  this.pubSubs.publish('gameWon', {
    winner: winningSide
  });

  return this;
};

/**
 * Publishes to a PubSub object with winner information for use by other modules
 *
 * @method publishDraw
 * @chainable
 */
Game.prototype.publishDraw = function() {
  this.pubSubs.publish('gameDrawn', {
    draw: true
  });

  return this;
};