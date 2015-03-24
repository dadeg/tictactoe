describe("Board Unit Tests", function() {

  beforeEach(function() {
    this.testBoard = new ticTacToe.Board({numberOfSquares: 9});
  });

  it("should be able to report its status", function() {
    var expectedBoard = [0,0,0,0,0,0,0,0,0];
    this.testBoard.squareStatus = [0,0,0,0,0,0,0,0,0];
    expect(this.testBoard.getStatus()).toEqual(expectedBoard);
  });

  it("should throw an error with a weird board size", function() {
    expect(function(){ new ticTacToe.Board({numberOfSquares: 17}); } ).toThrow(new Error("argument must be an odd square number.  9, 25, 49, etc."));
    expect(function(){ new ticTacToe.Board({numberOfSquares: '5'}); } ).toThrow(new Error("argument must be integer"));
  });

  it("can set the move for the next player", function() {
    expectedBoard = [0,0,1,0,0,0,0,0,0];
    this.testBoard.setMove(2);
    expect(this.testBoard.getStatus()).toEqual(expectedBoard);
  });

  it("throws an error for an invalid move", function() {
    this.testBoard.squareStatus = [0,0,1,0,0,0,0,0,0];

    expect(function(){ this.testBoard.setMove(2); }.bind(this)).toThrow(new Error("That is not a valid move"));
  });

  it("can count the squares", function() {
    expect(this.testBoard.getNumberOfSquares()).toEqual(9);
  });

  it("knows the value of a particular square", function() {
    this.testBoard.squareStatus = [0,0,1,0,0,0,0,0,0];
    expect(this.testBoard.getSquareValue(2)).toEqual(1);
    this.testBoard.squareStatus = [0,0,0,0,2,0,0,0,0];
    expect(this.testBoard.getSquareValue(4)).toEqual(2);
  });

  it("knows who the next player should be", function() {
    this.testBoard.squareStatus = [1,0,0,0,0,0,0,0,0];

    expect(this.testBoard.findNextPlayer()).toEqual(2);

    expect(this.testBoard.compareMovesToDetermineNextPlayer(3,3)).toEqual(1);
    expect(this.testBoard.compareMovesToDetermineNextPlayer(4,3)).toEqual(2);
  });

  it("can count player moves", function() {
    this.testBoard.squareStatus = [1,2,1,0,0,0,0,0,0];

    expect(this.testBoard.countPlayersMoves(1)).toEqual(2);
    expect(this.testBoard.countPlayersMoves(2)).toEqual(1);
  });

  it("can count total moves", function() {
    this.testBoard.squareStatus = [1,2,1,0,0,0,0,0,0];

    expect(this.testBoard.getSquaresPlayed()).toEqual(3);
  });

  it("can tell if a square is empty", function() {
    this.testBoard.squareStatus = [1,2,1,0,0,0,0,0,0];

    expect(this.testBoard.isSquareEmpty(2)).toEqual(false);
    expect(this.testBoard.isSquareEmpty(5)).toEqual(true);
  });

  it("can tell if a square is equal to a value", function() {
    this.testBoard.squareStatus = [1,2,1,0,0,0,0,0,0];

    expect(this.testBoard.isSquareEqual(0, 1)).toEqual(true);
    expect(this.testBoard.isSquareEqual(2, 1)).toEqual(true);
    expect(this.testBoard.isSquareEqual(1, 2)).toEqual(true);
    expect(this.testBoard.isSquareEqual(5, 0)).toEqual(true);
    expect(this.testBoard.isSquareEqual(1, 0)).toEqual(false);
  });

  it("knows if the middle has been played", function() {
    this.testBoard.squareStatus = [1,2,1,0,0,0,0,0,0];
    expect(this.testBoard.middleHasBeenPlayed()).toEqual(false);
    this.testBoard.squareStatus = [1,2,1,0,2,0,0,0,0];
    expect(this.testBoard.middleHasBeenPlayed()).toEqual(true);
  });

  it("knows the middle square", function() {
    expect(this.testBoard.getMiddleSquare()).toEqual(4);
  });

  it("knows how many rows are in the board", function() {
    expect(this.testBoard.getRowCount()).toEqual(3);
  });

  it("knows how many diagonal rows are in the board", function() {
    expect(this.testBoard.getDiagonalRowCount()).toEqual(2);
  });

  it("can map a coordinate of a column and row to a specific square and vice versa", function() {
    var column = 1;
    var positionInColumn = 2;
    expect(this.testBoard.mapVerticalColumnToSquare(column, positionInColumn)).toEqual(7);
    expect(this.testBoard.mapDiagonalColumnToSquare(column, positionInColumn)).toEqual(6);
    expect(this.testBoard.mapHorizontalColumnToSquare(column, positionInColumn)).toEqual(5);
    expect(this.testBoard.mapSquareToHorizontalColumn(5)).toEqual([column, positionInColumn]);
  });

  it("knows the corner squares", function() {
    expectedArray = [0,2,6,8];

    expect(this.testBoard.findCorners()).toEqual(expectedArray);
  });

  it("knows the edge squares", function() {
    expectedArray = [0,1,2,3,5,6,7,8];

    expect(this.testBoard.findEdges()).toEqual(expectedArray);
  });

  it("knows the first and last columns", function() {
    expect(this.testBoard.getFirstColumn()).toEqual(0);
    expect(this.testBoard.getLastColumn()).toEqual(2);
  });

  it("can find the opposite corner", function() {
    expect(this.testBoard.getOppositeCorner(0)).toEqual(8);
    expect(this.testBoard.getOppositeCorner(8)).toEqual(0);
    expect(this.testBoard.getOppositeCorner(2)).toEqual(6);
    expect(this.testBoard.getOppositeCorner(6)).toEqual(2);
  });


});
