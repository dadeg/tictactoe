describe("AiAdapter Unit Tests", function() {

  beforeEach(function() {
    this.aiAdapter = new ticTacToe.AiAdapter();
    this.board = {};

  });

  it("should know if there is a square to play", function() {
    this.board.getNumberOfSquares = function () {};
    this.board.isSquareEmpty = function () {};

    spyOn(this.board, "getNumberOfSquares").and.returnValue(9);
    spyOn(this.board, "isSquareEmpty").and.returnValue(true);

    expect(this.aiAdapter.confirmThereIsAMoveAvailable(this.board)).toEqual(0);
  });

  it("should be able to find the opponent", function() {
    expect(this.aiAdapter.getOpponent(1)).toEqual(2);
    expect(this.aiAdapter.getOpponent(2)).toEqual(1);
  });

  it("should know if a spot is a winning spot", function() {
    this.board.getRowCount = function () {};

    spyOn(this.board, "getRowCount").and.returnValue(3);

    expect(this.aiAdapter.wouldBeWinningSpot(true, 2, this.board)).toEqual(true);
    expect(this.aiAdapter.wouldBeWinningSpot(false, 2, this.board)).toEqual(false);
    expect(this.aiAdapter.wouldBeWinningSpot(true, 1, this.board)).toEqual(false);
  });

  it("should know if a row has only a single move", function() {
    expect(this.aiAdapter.isSoloAndRestEmpty(1,0)).toEqual(true);
    expect(this.aiAdapter.isSoloAndRestEmpty(2,0)).toEqual(false);
    expect(this.aiAdapter.isSoloAndRestEmpty(2,2)).toEqual(false);
    expect(this.aiAdapter.isSoloAndRestEmpty(3,3)).toEqual(false);
  });

  it("can find the first empty corner", function() {
    this.board.findCorners = function () {};
    this.board.isSquareEmpty = function () {};

    spyOn(this.board, "findCorners").and.returnValue([0,2,6,8]);
    spyOn(this.board, "isSquareEmpty").and.returnValue(true);
    expect(this.aiAdapter.findOpenCorner(this.board)).toEqual(0);
  });

  it("can tell if a corner has been played", function() {
    this.board.findCorners = function () {};
    this.board.isSquareEmpty = function () {};

    spyOn(this.board, "findCorners").and.returnValue([0,2,6,8]);
    spyOn(this.board, "isSquareEmpty").and.returnValue(false);
    expect(this.aiAdapter.cornerHasBeenPlayed(this.board)).toEqual(true);
  });

  it("determine if the board is empty", function() {
    this.board.getSquaresPlayed = function () {};

    spyOn(this.board, "getSquaresPlayed").and.returnValue(0);
    expect(this.aiAdapter.isFirstMove(this.board)).toEqual(true);
  });

  it("determine if the board has a middle and corner played", function() {
    this.board.middleHasBeenPlayed = function () {};

    spyOn(this.board, "middleHasBeenPlayed").and.returnValue(true);
    spyOn(this.aiAdapter, "cornerHasBeenPlayed").and.returnValue(true);
    expect(this.aiAdapter.PlayedCornerThenPlayedMiddle(this.board)).toEqual(true);

  });

  it("can find the opposite corner of a played corner", function() {
    this.board.findCorners = function () {};
    this.board.getOppositeCorner = function () {};
    this.board.isSquareEmpty = function () {};

    spyOn(this.board, "findCorners").and.returnValue([0,2,6,8]);
    spyOn(this.board, "getOppositeCorner").and.returnValue(8);
    spyOn(this.board, "isSquareEmpty").and.callFake(function(square) {
     if (square === 0) return false;
     return true;
    });

    expect(this.aiAdapter.oppositeCorner(this.board)).toEqual(8);

  });

  it("knows if two opposing corners and the middle has been played", function() {
    this.board.middleHasBeenPlayed = function () {};

    spyOn(this.aiAdapter, "opposingCornersPlayed").and.returnValue(true);
    spyOn(this.board, "middleHasBeenPlayed").and.returnValue(true);

    expect(this.aiAdapter.playedOppositeCornersAndMiddle(this.board)).toEqual(true);

  });

  it("knows if two opposing corners have been played", function() {
    this.board.findCorners = function () {};
    this.board.isSquareEmpty = function () {};
    this.board.getOppositeCorner = function () {};

    spyOn(this.board, "findCorners").and.returnValue([0,2,6,8]);
    spyOn(this.board, "isSquareEmpty").and.returnValue(false);
    spyOn(this.board, "getOppositeCorner").and.returnValue(8);

    expect(this.aiAdapter.opposingCornersPlayed(this.board)).toEqual(true);
  });

  it("can find the first edge which is not a corner that is empty", function() {
    this.board.findEdges = function () {};
    this.board.findCorners = function () {};
    this.board.isSquareEmpty = function () {};

    spyOn(this.board, "findEdges").and.returnValue([0,1,2,3,5,6,7,8]);
    spyOn(this.board, "findCorners").and.returnValue([0,2,6,8]);
    spyOn(this.board, "isSquareEmpty").and.returnValue(true);

    expect(this.aiAdapter.edgeNotCorner(this.board)).toEqual(1);
  });

});
