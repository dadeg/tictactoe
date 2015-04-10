describe("Player Unit Tests", function() {

  beforeEach(function() {
    this.aiPlayer = new ticTacToe.Player({adapter: new ticTacToe.AiAdapter, name: 'AI Player'});
  });

  it("should be able to set its name", function() {
    this.aiPlayer.setName('test');
    expect(this.aiPlayer.name).toEqual('test');
  });

  it("should be able to report its name", function() {
    expect(this.aiPlayer.getName()).toEqual('AI Player');
  });


});
