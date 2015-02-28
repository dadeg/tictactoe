describe("AiPlayer", function() {
  var aiPlayer;

  beforeEach(function() {
    aiPlayer = new ticTacToe.AiPlayer();
  });

  it("should be able to report its name", function() {

    expect(aiPlayer.getName()).toEqual('AI Player');

  });



});
