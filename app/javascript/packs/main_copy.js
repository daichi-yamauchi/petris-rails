"use strict";

const CanvField = document.getElementById("field");
let field = []; // フィールド配列

// フィールドの見た目設定
const fieldInfo = {
  size: [20, 10], // 単位はブロック数
  position: [50, 50],
  backColor: "#111",
  strokeColor: "#333",
  lineWidth: 1,
};

// ブロックの見た目設定
const blockInfo = {
  size: 20,
  strokeColor: "#fff",
  lineWidth: 1,
};

/* // ブロッククラス xy座標持ち
class Block {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  // 自身を描画するメソッド
  draw() {
    const ctx = CanvField.getContext("2d");

    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x * blockInfo.size,
      this.y * blockInfo.size,
      blockInfo.size,
      blockInfo.size
    );
    ctx.strokeStyle = blockInfo.strokeColor;
    ctx.lineWidth = blockInfo.lineWidth;
    ctx.strokeRect(
      this.x * blockInfo.size,
      this.y * blockInfo.size,
      blockInfo.size,
      blockInfo.size
    );
  }
} */

// ブロッククラス xy座標なし
class Block {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.ctx = CanvField.getContext("2d");
  }

  // 自身を消す関数
  clear() {
    this.ctx.clearRect(
      this.x * blockInfo.size,
      this.y * blockInfo.size,
      blockInfo.size,
      blockInfo.size
    );
  }

  // 自身を描画するメソッド
  draw(dx = 0, dy = 0) {
    this.clear();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      (this.x + dx) * blockInfo.size,
      (this.y + dy) * blockInfo.size,
      blockInfo.size,
      blockInfo.size
    );
    this.ctx.strokeStyle = blockInfo.strokeColor;
    this.ctx.lineWidth = blockInfo.lineWidth;
    this.ctx.strokeRect(
      (this.x + dx) * blockInfo.size,
      (this.y + dy) * blockInfo.size,
      blockInfo.size,
      blockInfo.size
    );
  }

  // // 自身を再描画する関数
  // redraw(x, y) {
  //   this.clear();
  //   this.draw(x, y);
  // }
}

/* // ペトリミノクラス ブロッククラスがxy座標を持つ前提
class Petrimino {
  constructor(mino) {
    this.blocks = [];
    mino.blocks.forEach((blockPos, i) => {
      this.blocks.push(new Block(blockPos[0], blockPos[1], mino.color));
      this.center = mino.center;
    });
  }

  draw() {
    this.blocks.forEach((block) => {
      block.draw();
    });
  }

  rotate() {}
} */

// ペトリミノクラス ブロッククラスがxy座標を持たない前提
class Petrimino {
  constructor(mino) {
    this.blocks = [];
    mino.blocks.forEach((blockPos, i) => {
      this.blocks.push(new Block(blockPos[0], blockPos[1], mino.color));
      this.center = mino.center;
      this.draw();
    });
  }

  draw() {
    this.blocks.forEach((block, i) => {
      block.draw();
    });
  }

  lmove() {
    this.blocks.forEach((block, i) => {
      this.blocks[i].draw(-1, 0);
    });
  }

  rotate() {}
}

// フィールドを生成する関数
function createField() {
  // フィールド配列を生成
  for (let i = 0; i < fieldInfo.size[0]; i++) {
    field[i] = Array(fieldInfo.size[1]);
  }

  // フィールドサイズを調整
  CanvField.width = fieldInfo.size[1] * blockInfo.size;
  CanvField.height = fieldInfo.size[0] * blockInfo.size;

  // マスを描写
  const ctx = CanvField.getContext("2d");
  ctx.beginPath();
  // 縦線
  for (let i = 1; i < fieldInfo.size[1]; i++) {
    ctx.moveTo(blockInfo.size * i, 0);
    ctx.lineTo(blockInfo.size * i, blockInfo.size * fieldInfo.size[0]);
  }
  // 横線
  for (let i = 1; i < fieldInfo.size[0]; i++) {
    ctx.moveTo(0, blockInfo.size * i);
    ctx.lineTo(blockInfo.size * fieldInfo.size[1], blockInfo.size * i);
  }
  ctx.closePath();
  ctx.strokeStyle = fieldInfo.strokeColor;
  ctx.lineWidth = fieldInfo.lineWidth;
  ctx.stroke();
}

const Imino = {
  blocks: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  centor: [1, 0],
  color: "skyblue",
};

let b;

//canvas未対応処置
if (typeof CanvField.getContext === "undefined") {
  console.log("キャンバス未対応");
} else {
  createField();
  b = new Petrimino(Imino);
  b.lmove();
  console.log(b);
}
