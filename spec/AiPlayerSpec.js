describe("AiPlayer", function() {
  var aiPlayer;

  beforeEach(function() {
    aiPlayer = new ticTacToe.AiPlayer();
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

  it("can set and get the number of squares on the board", function() {
    expect(aiPlayer.getNumberOfSquares()).toEqual(9);
    aiPlayer.setNumberOfSquares(16);
    expect(aiPlayer.getNumberOfSquares()).toEqual(16);
    expect(function(){ aiPlayer.setNumberOfSquares('not number'); }).toThrow(new Error("argument must be integer"));
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


});
