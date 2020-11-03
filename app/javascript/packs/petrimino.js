import { gmCf } from "./config.js";
import { clearDraw, drawBlock, blocksPos } from "./functions.js";

export default class Petrimino {
  constructor(index, game) {
    const mino = Petrimino.minoList(index);
    this.blocks = mino.blocks;
    this.position = mino.position;
    this.center = mino.center;
    this.slipVector = mino.slipVector;
    this.color = mino.color;
    this.index = index;
    this.holdFlag = false;
    this.fallCount = 0;
    this.game = game;
    this.field = game.field;
    this.draw();
  }

  // ペトリミノの形、色等の定義
  static minoList = (index) => {
    return [
      {
        // I mino
        blocks: [
          [-2, 0],
          [-1, 0],
          [0, 0],
          [1, 0],
        ],
        position: [5, 1], // 初期位置
        center: [-0.5, 0], // 中心位置
        slipVector: [0, 1],
        color: "skyBlue",
      },
      {
        // J mino
        blocks: [
          [-1, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
        ],
        position: [4, 1], // 初期位置
        center: [0, -0.5], // 中心位置
        slipVector: [0, 0],
        color: "Blue",
      },
      {
        // L mino
        blocks: [
          [-1, 0],
          [0, 0],
          [1, 0],
          [1, -1],
        ],
        position: [4, 1], // 初期位置
        center: [0, -0.5], // 中心位置
        slipVector: [0, 0],
        color: "Orange",
      },
      {
        // S mino
        blocks: [
          [-1, 0],
          [0, 0],
          [0, -1],
          [1, -1],
        ],
        position: [4, 1], // 初期位置
        center: [0, -0.5], // 中心位置
        slipVector: [0, 0],
        color: "Green",
      },
      {
        // Z mino
        blocks: [
          [-1, -1],
          [0, -1],
          [0, 0],
          [1, 0],
        ],
        position: [4, 1], // 初期位置
        center: [0, -0.5], // 中心位置
        slipVector: [0, 0],
        color: "Pink",
      },
      {
        // T mino
        blocks: [
          [-1, 0],
          [0, 0],
          [0, -1],
          [1, 0],
        ],
        position: [5, 1], // 初期位置
        center: [0, -0.5], // 中心位置
        slipVector: [0, 0],
        color: "Violet",
      },
      {
        // O mino
        blocks: [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, -0.5],
          [0.5, 0.5],
        ],
        position: [4.5, 0.5], // 初期位置
        center: [0, 0], // 中心位置
        slipVector: [0, 0],
        color: "Yellow",
      },
    ][index];
  };

  // ペトリミノを描画するメソッド
  draw() {
    clearDraw("field");
    this.field.draw();
    blocksPos(this.position, this.blocks).forEach((block) => {
      drawBlock(
        [block[0], block[1] - gmCf.hideFieldHeight],
        this.color,
        "field"
      );
    });
  }

  // 移動可能性を判定する関数, 返り値;可能:1, 不可能:0
  canMove(dX, dY = 0) {
    return blocksPos(this.position, this.blocks).every(
      (block) => !this.field.checkBlock([block[0] + dX, block[1] + dY])
    );
  }

  // 自身を1マス下げるメソッド 移動できる場合は1を返し、移動できない場合は0を返す
  down() {
    let result;
    if (this.canMove(0, 1)) {
      this.position[1] += 1;
      this.draw();
      result = 1;
    } else {
      result = 0;
    }
    return result;
  }

  // 一定時間ごとに降下するメソッド
  async fall() {
    while (true) {
      await new Promise((resolve) =>
        setTimeout(resolve, gmCf.fallCountInt)
      );
      this.fallCount += gmCf.fallCountInt;
      if (this.fallCount >= gmCf.fallInt) {
        if (!this.down()) return; // 落下できない=ブロックが固定されるときにresolveを返す。
        this.fallCount = 0;
      }
      if (this.holdFlag) {
        clearDraw("field");
        this.field.draw();
        return;
      }
    }
  }

  // 自身を1マス左へ移動するメソッド
  moveL() {
    if (this.canMove(-1)) {
      this.position[0] -= 1;
      this.draw();
    }
  }

  // 自身を1マス右へ移動するメソッド
  moveR() {
    if (this.canMove(1)) {
      this.position[0] += 1;
      this.draw();
    }
  }

  // ↓が押されたときの動作メソッド
  moveD() {
    this.fallCount = gmCf.fallInt;
  }

  // 一瞬で落下させるメソッド
  bottom() {
    while (this.down())
      setTimeout(
        () => (this.fallCount = gmCf.fallInt),
        gmCf.fallCountInt
      );
  }

  // 回転させるメソッド
  rotate() {
    let afterBlocks = this.blocks.map((block, i) => [-block[1], block[0]]);
    let afterPosition = this.position.map((v, i) => v + this.slipVector[i]);
    let canMove = blocksPos(afterPosition, afterBlocks).every(
      (block) => !this.field.checkBlock(block)
    );
    if (canMove) {
      this.blocks = afterBlocks;
      this.position = afterPosition;
      this.slipVector = [-this.slipVector[1], this.slipVector[0]];
    }
    this.draw();
  }

  // 逆回転させるメソッド
  rotateInv() {
    let afterBlocks = this.blocks.map((block, i) => [block[1], -block[0]]);
    let canMove = blocksPos(this.position, afterBlocks).every(
      (block) => !this.field.checkBlock(block)
    );
    if (canMove) {
      this.blocks = afterBlocks;
      this.slipVector = [this.slipVector[1], -this.slipVector[0]];
      this.position = this.position.map((v, i) => v - this.slipVector[i]);
    }
    this.draw();
  }
}
