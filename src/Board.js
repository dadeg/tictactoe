var ticTacToe = ticTacToe || {};

(function (app) {

  /**
   * An adapter for the Player class that implements asking the user for moves through HTML.
   *
   * @class HtmlAdapter
   * @constructor
   */
  app.Board = function (options) {
    if (!options) {
      this.options = {};
    } else {
      this.options = options;
    }

    this.numberOfSquares = this.options.numberOfSquares || 9;
    this.confirmBoardSizeIsValidNumber(this.numberOfSquares);

    this.squareStatus = Array.apply(null, Array(this.numberOfSquares)).map(function() { return 0; });
  };

  /**
   * Getter for squares on board
   */
  app.Board.prototype.getStatus = function () {
    return this.squareStatus;
  };

  app.Board.prototype.getNumberOfSquares = function () {
    return this.numberOfSquares;
  };

  app.Board.prototype.confirmBoardSizeIsValidNumber = function (number) {
    if (!Number.isInteger(number)) {
      throw new Error("argument must be integer");
    }
    if (!Number.isInteger(Math.sqrt(number)) && number % 2 !== 0) {
      throw new Error("argument must be an odd square number.  9, 25, 49, etc.");
    }
  };

  app.Board.prototype.setMove = function (square) {
    if (this.isSquareEmpty(square)) {
      this.squareStatus[square] = this.findNextPlayer();
      return;
    }

    throw new Error("That is not a valid move")
  };

  app.Board.prototype.getSquareValue = function (square) {
    return this.squareStatus[square];
  };

  app.Board.prototype.findNextPlayer = function () {
    return this.compareMovesToDetermineNextPlayer(this.countPlayersMoves(1), this.countPlayersMoves(2));
  };

  app.Board.prototype.countPlayersMoves = function (player) {
    var moveCount = 0;
    this.squareStatus.forEach(function (squareValue) {
      if (squareValue === player) moveCount++;
    });
    return moveCount;
  };

  app.Board.prototype.compareMovesToDetermineNextPlayer = function (playerOneMoves, playerTwoMoves) {
    if (playerOneMoves === playerTwoMoves) {
      return 1;
    }
    return 2;
  };

  app.Board.prototype.getSquaresPlayed = function () {
    var squaresPlayed = 0;
    var i;
    for (i = 0; i < this.getNumberOfSquares(); i++) {
      if (!this.isSquareEmpty(i)) {
        squaresPlayed++;
      }
    }
    return squaresPlayed;
  };

  app.Board.prototype.isSquareEmpty = function (square) {
    return this.isSquareEqual(square, 0);
  };

  app.Board.prototype.isSquareEqual = function (square, value) {
    return (this.getSquareValue(square) === value);
  };

  app.Board.prototype.getMiddleSquare = function () {
    return (this.getNumberOfSquares() - 1) / 2;
  };

  app.Board.prototype.middleHasBeenPlayed = function () {
    return !this.isSquareEmpty(this.getMiddleSquare());
  };

  app.Board.prototype.getRowCount = function () {
    return Math.sqrt(this.getNumberOfSquares());
  };

  app.Board.prototype.getDiagonalRowCount = function () {
    return 2;
  };

  /**
   * Algorithm for determining the square number based on column and position.
   * @param {integer} columnNumber   left to right, 0,1,2.
   * @param {integer} columnPosition top to bottom, 0,1,2.
   */
  app.Board.prototype.mapVerticalColumnToSquare = function (columnNumber, positionInColumn) {
    if (columnNumber >= this.getRowCount() || positionInColumn >= this.getRowCount()) return undefined;
    return columnNumber + (this.getRowCount() * positionInColumn);
  };

  /**
   * Algorithm for determining the square number based on row and position.
   * @param {integer} columnNumber   top to bottom, 0,1,2.
   * @param {integer} columnPosition left to right, 0,1,2.
   */
  app.Board.prototype.mapHorizontalColumnToSquare = function (columnNumber, positionInColumn) {
    if (columnNumber >= this.getRowCount() || positionInColumn >= this.getRowCount()) return undefined;
    return (this.getRowCount() * columnNumber) + positionInColumn;
  };

  /**
   * algorithm for determining row and position in row based on the square
   * @param {integer} square the square on the board
   */
  app.Board.prototype.mapSquareToHorizontalColumn = function (square) {
    var column = Math.floor(square/this.getRowCount());
    var position = square % this.getRowCount();
    return [column, position];
  };

  /**
   * Algorithm for determining the square number based on row and position.
   * 3x3
   * 0,4,8. x = r*4 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 2,4,6. x = (r+1)*2 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * 5x5
   * 0,6,12,18,24. x = r*6 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 4,8,12,16,20. x = (r+1)*4 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * 7x7
   * 0,8,16,24,32,40,48.  x = r*8 = row*(numRows+1) = (row+col)*(numRows+1-(col*2))
   * 6,12,18,24,30,36,42. x = (r+1)*6 = (row+1)*(numRows-1) = (row+col)*(numRows+1-(col*2))
   * @param {integer} columnNumber   top left to bottom right = 0. top right to bottom left = 1.
   * @param {integer} columnPosition from top to bottom, 0,1,2.
   */
  app.Board.prototype.mapDiagonalColumnToSquare = function (columnNumber, positionInColumn) {
    if (columnNumber >= this.getDiagonalRowCount() || positionInColumn >= this.getRowCount()) return undefined;
    return (positionInColumn + columnNumber) * (this.getRowCount()+1-(columnNumber * 2));
  };

  /**
   * return array of edge squares.
   */
  app.Board.prototype.findEdges = function () {
    var edges = [];
    var row = 0;
    while (row < this.getRowCount()) {
      if(row === 0 || row === this.getRowCount()-1) {
        var column = 0;
        while (column < this.getRowCount()) {
          edges.push(this.mapHorizontalColumnToSquare(row, column));
          column++;
        }
      } else {
        edges.push(this.mapHorizontalColumnToSquare(row, this.getFirstColumn()));
        edges.push(this.mapHorizontalColumnToSquare(row, this.getLastColumn()));
      }
      row++;
    }
    return edges;
  };

  /**
   * returns array of corner squares.
   */
  app.Board.prototype.findCorners = function () {
    return [this.mapHorizontalColumnToSquare(this.getFirstColumn(), this.getFirstColumn()),
            this.mapHorizontalColumnToSquare(this.getFirstColumn(), this.getLastColumn()),
            this.mapHorizontalColumnToSquare(this.getLastColumn(), this.getFirstColumn()),
            this.mapHorizontalColumnToSquare(this.getLastColumn(), this.getLastColumn())];
  };

  app.Board.prototype.getFirstColumn = function () {
    return 0;
  };

  app.Board.prototype.getLastColumn = function () {
    return this.getRowCount()-1;
  };

  app.Board.prototype.getOppositeCorner = function (square) {
    if (this.findCorners().indexOf(square) === -1) throw new Error("square is not a corner");

    var coordinates = this.mapSquareToHorizontalColumn(square);

    if (coordinates[0] === this.getFirstColumn()) {
      coordinates[0] = this.getLastColumn();
    } else {
      coordinates[0] = this.getFirstColumn();
    }

    if (coordinates[1] === this.getFirstColumn()) {
      coordinates[1] = this.getLastColumn();
    } else {
      coordinates[1] = this.getFirstColumn();
    }

    return this.mapHorizontalColumnToSquare(coordinates[0], coordinates[1]);
  };

})(ticTacToe);
