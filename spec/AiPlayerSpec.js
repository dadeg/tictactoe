describe("AiPlayer", function() {
  var aiPlayer;

  beforeEach(function() {
    aiPlayer = new ticTacToe.Player({adapter: new ticTacToe.AiAdapter, name: 'AI Player'});
  });

  it("should be able to report its name", function() {
    expect(aiPlayer.getName()).toEqual('AI Player');
  });

  it("should be able to make a move", function() {
    board = [0,1,2,0,0,0,0,0,0];
    side = 1;
    expect(aiPlayer.getMove(board, side)).toMatch(/[0-9]/);
  });

  it("should throw an error when given a bad board", function() {
    board = [0,1,2,0,0,0,0,0]; // not enough squares
    side = 1;
    expect(function(){ aiPlayer.getMove(board, side); } ).toThrow(new Error("invalid board"));
  });

  it("should throw an error when given a bad side", function() {
    board = [0,1,2,0,0,0,0,0,0];
    side = 'abc'; // nonsense
    expect(function(){ aiPlayer.getMove(board, side); } ).toThrow(new Error("invalid side"));
  });

  it("knows when a board is full", function() {
    board = [1,1,1,1,1,1,1,1,1];
    side = 1;
    expect(function(){ aiPlayer.getMove(board, side); }).toThrow(new Error("there are no available squares to play"));
  });

  it("can find the winning move in vertical positions", function() {
    board = [0,1,2,0,1,2,0,0,0];
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(7);
  });

  it("can find the winning move in horizontal positions", function() {
    board = [0,0,0,2,2,0,1,1,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(5);
  });

  it("can find the winning move in diagonal positions", function() {
    board = [1,2,0,2,1,0,0,0,0];
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block an opponent from winning in vertical positions", function() {
    board = [2,1,0,0,1,2,0,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(7);
  });

  it("can block an opponent from winning in horizontal positions", function() {
    board = [2,0,0,2,0,0,1,1,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block an opponent from winning in diagonal positions", function() {
    board = [1,2,0,2,1,0,0,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can choose a diagonal move to make two in a row", function() {
    board = [2,0,0,1,0,0,0,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
    board = [0,1,2,0,0,0,0,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(6);
    board = [0,1,0,0,0,0,0,0,2];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(0);
    board = [0,1,0,0,0,0,2,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(2);
    board = [0,1,0,0,2,0,0,0,0];
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can block a diagonal move to make two in a row by opponent", function() {
    board = [2,1,0,0,0,0,0,2,0];
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(8);
  });

  it("can choose a vertical move to make two in a row", function() {
    board = [1,0,0,0,0,0,0,0,2]; // 2 blocks the preferable diagonal
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(6);
  });

  it("can choose a horizontal move to make two in a row", function() {
    board = [1,0,0,2,0,0,0,0,2]; // 2 blocks the preferable diagonal and vertical
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(2);
  });

  it("can choose a vertical move to block an opponent from making two in a row", function() {
    board = [1,0,0,0,0,1,0,1,2]; // 2 blocks the preferable diagonal
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(6);
  });

  it("can choose a horizontal move to block an opponent from making two in a row", function() {
    board = [1,0,0,1,1,1,2,2,2]; // isolating the horizontal row alone.
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(2);
  });

  it("can play a perfect game as player 1", function() {
    board = [0,0,0,0,0,0,0,0,0];
    side = 1;
    expect(aiPlayer.getMove(board, side)).toEqual(0); // p1 plays corner.
    board = [1,0,0,0,2,0,0,0,0]; // p2 plays middle.
    expect(aiPlayer.getMove(board, side)).toEqual(8); // p1 plays opposite corner.
    board = [1,0,0,0,2,2,0,0,1]; // p2 plays side but not corner.
    expect(aiPlayer.getMove(board, side)).toEqual(3); // p1 blocks p2 with other corner.
    board = [1,0,0,1,2,2,2,0,1]; // p2 blocks p1.
    expect(aiPlayer.getMove(board, side)).toEqual(2); // p1 blocks p2.
    board = [1,2,1,1,2,2,2,0,1]; // p2 blocks p1.
    expect(aiPlayer.getMove(board, side)).toEqual(7); // p1 blocks p2. draw.
  });

  it("can play a perfect game as player 2", function() {
    board = [1,0,0,0,0,0,0,0,0]; // p1 plays corner
    side = 2;
    expect(aiPlayer.getMove(board, side)).toEqual(4); // p2 plays middle.
    board = [1,0,0,0,2,0,0,0,1]; // p1 plays opposite corner.
    expect(aiPlayer.getMove(board, side)).toEqual(1); // p2 plays side but not corner.
    board = [1,2,0,0,2,0,0,1,1]; // p1 plays side but not corner to block.
    expect(aiPlayer.getMove(board, side)).toEqual(6); // p2 blocks p1 with other corner.
    board = [1,2,1,0,2,0,2,1,1]; // p1 blocks p2.
    expect(aiPlayer.getMove(board, side)).toEqual(5); // p2 blocks p1.
    board = [1,2,1,0,2,2,2,1,1]; // p1 blocks p2.
    expect(aiPlayer.getMove(board, side)).toEqual(3); // p2 blocks p1. draw.
  });




});
