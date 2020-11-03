import { gmCf } from "./config.js";
import Field from "./field.js";
import Petrimino from "./petrimino.js";
import { clearDraw, drawBlock, blocksPos } from "./functions.js";

export default class Game {
  constructor() {
    this.field = new Field();
    this.correct = new Array(gmCf.numMinoType).fill(1);
    this.nextMinos = new Array(gmCf.numNextMino)
      .fill(0)
      .map(() => this.corRandom());
    // 最初のみ実行、ミノの順番をランダムに生成
    this.holdMino = null;
    this.holdFlag = true; // ホールドフラグ trueでホールド可能
    this.keyState = {};
    this.score = 0;

  }

  /*
   *  メインの実行関数
   *    ・ペトリミノの生成
   *    ・キーダウンイベントの設置
   *    ・ゲームオーバ判定
   *    等を呼び出し、ゲームオーバになれば、rsolveを返す。
   */
  async start() {
    let gameOverFlag = false;
    const inputId = this.InputKey.bind(this);
    document.addEventListener("keyup", this.upKey.bind(this));
    while (true) {
      if (!this.mino) this.mino = new Petrimino(this.next(), this);
      if (this.checkGameOver1()) gameOverFlag = true;
      document.addEventListener("keydown", inputId);
      await this.mino.fall();
      document.removeEventListener("keydown", inputId);
      if (!this.mino.holdFlag) {
        if (this.checkGameOver2()) gameOverFlag = true;
        this.killPetrimino();
        await new Promise((resolve) =>
          setTimeout(resolve, gmCf.nextMinoInt)
        );
      } else this.hold();
      if(gameOverFlag) return;
    }
  }

  // ペトリミノを固定し、終了する関数
  killPetrimino() {
    blocksPos(this.mino.position, this.mino.blocks).forEach((block, i) => {
      this.field.blocks[block[1]][block[0]] = this.mino.color;
    });
    delete this.mino;
    const delLines = this.field.deleteLine();
    this.scoreAdd(gmCf.scoreMap[delLines]);
    this.holdFlag = true;
  }

  // キー入力を受け付ける関数
  InputKey(event) {
    const key = event.key;

    if (!this.keyState[key]) {
      switch (key) {
        case "ArrowLeft":
        case "a":
          this.mino.moveL();
          break;
        case "ArrowRight":
        case "s":
          this.mino.moveR();
          break;
        case "ArrowDown":
        case "z":
          this.mino.moveD();
          break;

        case "ArrowUp":
        case "w":
          this.mino.bottom();
          break;
        case " ":
          this.mino.rotate();
          break;
        case "b":
          this.mino.rotateInv();
          break;
        case "c":
        case "m":
          if (this.holdFlag) this.mino.holdFlag = true;
          break;
      }
    }
    this.keyState[key] = true;
  }

  // キーが離されたら、キー状態をfalseにする関数
  upKey(event) {
    const key = event.key;
    this.keyState[key] = false;
  }

  /*
   * 補正ランダム関数
   *   出るミノが偏らないようにランダムを補正
   *   具体的には、出たミノの確率を1/2して、他の確率を合計が合うように上げる
   */
  corRandom() {
    const sum = this.correct.reduce((accu, curr) => accu + curr);
    let rand = Math.random() * sum;
    const result = this.correct.findIndex((v) => (rand -= v) < 0);
    const otherSum = sum - this.correct[result];
    this.correct = this.correct.map((v, i) => {
      if (i === result) return v / 2;
      else return (v * (gmCf.numMinoType / otherSum + 1)) / 2;
    });
    return result;
  }

  /*
   * 次のミノを決める関数
   *   ・ミノインデックスの順番配列をランダムに生成
   *   ・ミノの順番を表示
   *   ・返り値:次のミノのインデックス
   */
  next() {
    const nextMino = this.nextMinos.shift(); // 次のミノインデックス
    this.nextMinos.push(this.corRandom());
    // ミノの順番の最後にランダムなインデックスを追加
    clearDraw("next");
    this.nextMinos.forEach((minoIndex, i) => {
      const mino = Petrimino.minoList(minoIndex);
      blocksPos(
        [2 - mino.center[0], 1.5 - mino.center[1] + 4 * i],
        mino.blocks
      ).forEach((block) => {
        drawBlock(block, mino.color, "next", 0.5);
      });
    });
    return nextMino;
  }

  /*
   * 現在のミノをホールドするメソッド
   *   ・ホールドがある場合は、ホールド中のミノをフィールドへ出す
   *   ・ホールドがない場合は、次のミノをフィールドへ出す
   *   ・現在のミノをホールドする
   *   ・ホールドしたミノを表示する
   */
  hold() {
    this.holdFlag = false;
    const prevHold = this.holdMino;
    this.holdMino = this.mino.index;
    if (prevHold !== null) this.mino = new Petrimino(prevHold, this);
    else delete this.mino;
    clearDraw("hold");
    const displayMino = Petrimino.minoList(this.holdMino);
    blocksPos(
      [2 - displayMino.center[0], 1.5 - displayMino.center[1]],
      displayMino.blocks
    ).forEach((block) => drawBlock(block, displayMino.color, "hold", 0.5));
  }

  scoreAdd(value) {
    this.score += value;
    document.getElementById("score").innerHTML = `${this.score}`;
  }

  /*
   * ゲームオーバ判定1
   *   判定条件: フィールドのブロックがペトリミノの出現位置とかぶっているか
   */
  checkGameOver1() {
    return !blocksPos(this.mino.position, this.mino.blocks).every(
      (block) => !this.field.checkBlock(block)
    );
  }

  /*
   * ゲームオーバ判定2
   *   判定条件: おいたブロックがすべてフィールド外か
   */
  checkGameOver2() {
    return !blocksPos(this.mino.position, this.mino.blocks).every(
      (block) => block[1] > gmCf.hideFieldHeight
    );
  }

  /*
   *  ゲームオーバーの演出
   *    ・下からグレーのブロックを積み上げ
   * 
   */
  async gameOver() {
    for(let i = this.field.blocks.length; i >= gmCf.hideFieldHeight; i--) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      this.field.blocks[i] = new Array(gmCf.fieldSize[0]).fill('gray');
      clearDraw("field");
      this.field.draw();
    }
    document.getElementById("gameover").classList.remove("hide");
  }
}
