const game = {
  fieldSize: [10, 20], // フィールドサイズ(block)
  hideFieldHeight: 2, // フィールド上部のサイズ
  fallInt: 700, // 落下速度(ms/block)
  fallCountInt: 10, // フォール判定のインターバル(ms)
  nextMinoInt: 30, // 次のミノが落ちてくるまでのインターバル(ms)
  numNextMino: 3, // 次のミノが表示される数
  numMinoType: 7, // ミノのタイプ数
  fieldScale: 1,
  nextScale: 0.5,
  holdScale: 0.5,
  scoreMap: [0, 10, 20, 40, 100],
};

const display = {
  fieldScale: 1,
  nextScale: 0.5,
  holdScale: 0.5,
  // blockSize: canvas.back.height / game.fieldSize[1],
  blockSize: blockSize(),
  blockStroke: "#fff",
  blockLineWidth: 1,
};

function blockSize() {
  const nX = game.fieldSize[0] + 5 * game.nextScale;
  const nY = game.fieldSize[1];
  const fieldH =
    document.documentElement.clientHeight * 0.9 -
    document.querySelector("div.howto").clientHeight;
  const fieldW =
    (document.documentElement.clientWidth * 0.8 * game.fieldSize[0]) / nX;
  if (fieldW / nX < fieldH / nY) return fieldW / nX;
  else return fieldH / nY;
}

// フィールドの見た目設定
const field = {
  backColor: "#111",
  strokeColor: "#222",
  lineWidth: 1,
};

const canvas = {
  back: document.getElementById("back"),
  field: document.getElementById("field"),
  next: document.getElementById("next"),
  hold: document.getElementById("hold"),
};

const canvasStyle = {
  fieldW: game.fieldSize[0] * display.blockSize,
  fieldH: game.fieldSize[1] * display.blockSize,
  nextW: 5 * display.blockSize * display.nextScale,
  nextH: 4 * game.numNextMino * display.blockSize * display.nextScale + 1,
  holdW: 5 * display.blockSize * display.nextScale,
  holdH: 4 * display.blockSize * display.holdScale,
};

const context = {
  back: canvas.back.getContext("2d"),
  field: canvas.field.getContext("2d"),
  next: canvas.next.getContext("2d"),
  hold: canvas.hold.getContext("2d"),
};

export {
  canvas as cnv,
  canvasStyle as cnvStl,
  context as ctx,
  game as gmCf,
  display as dpCf,
  field as fdCf,
};
