describe("Game", function() {
  var game;
  var testBoard = new ticTacToe.Board({numberOfSquares: 9});
  var player1 = new ticTacToe.Player({adapter: new ticTacToe.AiAdapter, name: 'AI Player 1'});
  var player2 = new ticTacToe.Player({adapter: new ticTacToe.AiAdapter, name: 'AI Player 2'});

  beforeEach(function() {
    game = new Game(player1, player2);
  });

  it('should have an initialization method that returns the Game object', function() {
    expect(game.init()).toEqual(game);
  });

  it('should have an assignSides method that returns the Game object', function() {
    expect(game.assignSides()).toEqual(game);
  });

  it('should assign the player1 object a side of 1', function() {
    expect(game.player1.side).toEqual(1);
  });

  it('should assign the player1 object a side of 2', function() {
    expect(game.player2.side).toEqual(2);
  });

});
