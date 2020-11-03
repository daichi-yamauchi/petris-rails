"use strict";
import Game from "./game.js";
import { canvasResize, createBack } from "./functions.js";

// console.log('a')

(async () => {

  canvasResize();
  createBack();

  const game = new Game();
  await game.start();
  await game.gameOver();
})();
