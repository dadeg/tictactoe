
describe("Player & AiAdapter & Board Integration Tests", function() {

  beforeEach(function() {
    this.aiPlayer = new ticTacToe.Player({adapter: new ticTacToe.AiAdapter(), name: 'AI Player'});
  });

  it("should be able to make a move", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [0,1,2,0,0,0,0,0,0];
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toMatch(/[0-8]/);
  });

  it("should throw an error when given a bad side", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [0,1,2,0,0,0,0,0,0];
    var side = 'abc'; // nonsense
    expect(function(){ this.aiPlayer.getMove(board, side); }.bind(this)).toThrow(new Error("invalid side"));
  });

  it("knows when a board is full", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,1,1,1,1,1,1,1,1];
    var side = 1;
    expect(function(){ this.aiPlayer.getMove(board, side); }.bind(this)).toThrow(new Error("there are no available squares to play"));
  });

  it("can find the winning move in vertical positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [0,1,2,0,1,2,0,0,0];
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(7);
  });

  it("can find the winning move in horizontal positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [0,0,0,2,2,0,1,1,0];
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(5);
  });

  it("can find the winning move in diagonal positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,2,0,2,1,0,0,0,0];
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block an opponent from winning in vertical positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [2,1,0,0,1,2,0,0,0];
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(7);
  });

  it("can block an opponent from winning in horizontal positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [2,0,0,2,0,0,1,1,0];
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block an opponent from winning in diagonal positions", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,2,0,2,1,0,0,0,0];
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can choose a diagonal move to make two in a row", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [2,0,0,1,0,0,0,0,0];
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
    board.squareStatus = [0,1,2,0,0,0,0,0,0];
    side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(6);
    board.squareStatus = [0,1,0,0,0,0,0,0,2];
    side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(0);
    board.squareStatus = [0,1,0,0,0,0,2,0,0];
    side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(2);
    board.squareStatus = [0,1,0,0,2,0,0,0,0];
    side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block a diagonal move to make two in a row by opponent", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [2,1,0,0,0,0,0,2,0];
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can choose a vertical move to make two in a row", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,0,0,0,0,0,0,0,2]; // 2 blocks the preferable diagonal
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(6);
  });

  it("can choose a horizontal move to make two in a row", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,0,0,2,0,0,0,0,2]; // 2 blocks the preferable diagonal and vertical
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(2);
  });

  it("can choose a vertical move to block an opponent from making two in a row", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,0,0,0,0,1,0,1,2]; // 2 blocks the preferable diagonal
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(6);
  });

  it("can choose a horizontal move to block an opponent from making two in a row", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,0,0,1,1,1,2,2,2]; // isolating the horizontal row alone.
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(2);
  });

  it("can play a perfect game as player 1", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [0,0,0,0,0,0,0,0,0];
    var side = 1;
    expect(this.aiPlayer.getMove(board, side)).toEqual(0); // p1 plays corner.
    board.squareStatus = [1,0,0,0,2,0,0,0,0]; // p2 plays middle.
    expect(this.aiPlayer.getMove(board, side)).toEqual(8); // p1 plays opposite corner.
    board.squareStatus = [1,0,0,0,2,2,0,0,1]; // p2 plays side but not corner.
    expect(this.aiPlayer.getMove(board, side)).toEqual(3); // p1 blocks p2 with other corner.
    board.squareStatus = [1,0,0,1,2,2,2,0,1]; // p2 blocks p1.
    expect(this.aiPlayer.getMove(board, side)).toEqual(2); // p1 blocks p2.
    board.squareStatus = [1,2,1,1,2,2,2,0,1]; // p2 blocks p1.
    expect(this.aiPlayer.getMove(board, side)).toEqual(7); // p1 blocks p2. draw.
  });

  it("can play a perfect game as player 2", function() {
    var board = new ticTacToe.Board({numberOfSquares: 9});
    board.squareStatus = [1,0,0,0,0,0,0,0,0]; // p1 plays corner
    var side = 2;
    expect(this.aiPlayer.getMove(board, side)).toEqual(4); // p2 plays middle.
    board.squareStatus = [1,0,0,0,2,0,0,0,1]; // p1 plays opposite corner.
    expect(this.aiPlayer.getMove(board, side)).toEqual(1); // p2 plays side but not corner.
    board.squareStatus = [1,2,0,0,2,0,0,1,1]; // p1 plays side but not corner to block.
    expect(this.aiPlayer.getMove(board, side)).toEqual(6); // p2 blocks p1 with other corner.
    board.squareStatus = [1,2,1,0,2,0,2,1,1]; // p1 blocks p2.
    expect(this.aiPlayer.getMove(board, side)).toEqual(5); // p2 blocks p1.
    board.squareStatus = [1,2,1,0,2,2,2,1,1]; // p1 blocks p2.
    expect(this.aiPlayer.getMove(board, side)).toEqual(3); // p2 blocks p1. draw.
  });

});
