var ticTacToe = ticTacToe || {}

;(function (app) {
  app.AiPlayer = function (options)
  {
      if (!options) {
        options = {}
      }
      this.name = options.name || "AI Player";
  }

  app.AiPlayer.prototype.getName = function()
  {
      return this.name;
  }
})(ticTacToe);
