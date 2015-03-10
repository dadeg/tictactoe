describe("Board", function() {
  var testBoard;

  beforeEach(function() {
    testBoard = new ticTacToe.Board({numberOfSquares: 9});
  });

  it("should be able to report its status", function() {
    var expectedBoard = [0,0,0,0,0,0,0,0,0];
    expect(testBoard.getStatus()).toEqual(expectedBoard);
  });

  it("should throw an error with a weird board size", function() {
    expect(function(){ new ticTacToe.Board({numberOfSquares: 17}); } ).toThrow(new Error("argument must be an odd square number.  9, 25, 49, etc."));
    expect(function(){ new ticTacToe.Board({numberOfSquares: '5'}); } ).toThrow(new Error("argument must be integer"));
  });

  it("can set the move for the next player", function() {
    expectedBoard = [0,0,1,0,0,0,0,0,0];
    testBoard.setMove(2);
    expect(testBoard.getStatus()).toEqual(expectedBoard);
  });

  it("throws an error for an invalid move", function() {
    testBoard.setMove(2);

    expect(function(){ testBoard.setMove(2); }).toThrow(new Error("That is not a valid move"));
  });

});
