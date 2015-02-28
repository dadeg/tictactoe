describe("Game", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  it('should have a property player1', function() {
    expect(game.player1).not.toBeUndefined();
  });

  it('should have a property player2', function() {
    expect(game.player2).not.toBeUndefined();
  });

  it('should have a property gameBoard', function() {
    expect(game.gameBoard).not.toBeUndefined();
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
