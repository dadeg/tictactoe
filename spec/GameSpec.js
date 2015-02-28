describe("Game", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  it("should have a property player1", function() {

    expect(game.player1).toEqual(undefined);

  });

  it("should have a property player2", function() {

    expect(game.player2).toEqual(undefined);

  });

  it("should have a property gameBoard that is an Array with 9 null", function() {

    expect(game.player2).toEqual(undefined);

  });

  it("should have an initialization method that returns the Game object", function() {

    expect(game.init()).toEqual(game);

  });

});
