import { cnv, cnvStl, ctx, gmCf, dpCf, fdCf } from "./config.js";

/*
キャンバスの調整
  ・キャンバスの大きさ
  ・キャンバスのスケール
*/
export const canvasResize = () => {
  // 背景キャンバス
  cnv.back.setAttribute("width", cnvStl.fieldW);
  cnv.back.setAttribute("height", cnvStl.fieldH);

  // フィールドキャンバス
  cnv.field.setAttribute("width", cnvStl.fieldW);
  cnv.field.setAttribute("height", cnvStl.fieldH);

  // 次のミノのキャンバス\
  cnv.next.setAttribute("width", cnvStl.nextW);
  cnv.next.setAttribute("height", cnvStl.nextH);
  ctx.next.scale(dpCf.nextScale, dpCf.nextScale);

  // ホールドミノのキャンバス
  cnv.hold.setAttribute("width", cnvStl.holdW);
  cnv.hold.setAttribute("Height", cnvStl.holdH);
  ctx.hold.scale(dpCf.holdScale, dpCf.holdScale);

  divResize();
  
};

const divResize = () => {


  // 背景キャンバス
  const field = document.querySelector("div.field");
  field.style.cssText = `flex-basis: ${cnvStl.fieldW}px; height: ${cnvStl.fieldH}px`;
  
  // console.log(res)
  // field.setAttribute("height", cnvStl.fieldH);

  // フィールドキャンバス
  // cnv.field.setAttribute("width", cnvStl.fieldW);
  // cnv.field.setAttribute("height", cnvStl.fieldH);

  // 次のミノのキャンバス\
  cnv.next.setAttribute("width", cnvStl.nextW);
  cnv.next.setAttribute("height", cnvStl.nextH);
  ctx.next.scale(dpCf.nextScale, dpCf.nextScale);

  // ホールドミノのキャンバス
  cnv.hold.setAttribute("width", cnvStl.holdW);
  cnv.hold.setAttribute("Height", cnvStl.holdH);
  ctx.hold.scale(dpCf.holdScale, dpCf.holdScale);
};

/*
フィールド背景を生成する関数
*/
export const createBack = () => {
  ctx.back.beginPath();
  // 縦線
  for (let i = 1; i < gmCf.fieldSize[0]; i++) {
    ctx.back.moveTo(dpCf.blockSize * i, 0);
    ctx.back.lineTo(dpCf.blockSize * i, dpCf.blockSize * gmCf.fieldSize[1]);
  }
  // 横線
  for (let i = 1; i < gmCf.fieldSize[1]; i++) {
    ctx.back.moveTo(0, dpCf.blockSize * i);
    ctx.back.lineTo(dpCf.blockSize * gmCf.fieldSize[0], dpCf.blockSize * i);
  }
  ctx.back.closePath();
  ctx.back.strokeStyle = fdCf.strokeColor;
  ctx.back.lineWidth = fdCf.lineWidth;
  ctx.back.stroke();
};

// キャンバスの描画をクリアする関数
export const clearDraw = (canvasName) => {
  ctx[canvasName].clearRect(
    0,
    0,
    cnv[canvasName].width / dpCf[canvasName + "Scale"],
    cnv[canvasName].height / dpCf[canvasName + "Scale"]
  );
};

// ブロックをキャンバスへ描画するメソッド
export const drawBlock = (position, color, ctxName) => {
  ctx[ctxName].fillStyle = color;
  ctx[ctxName].strokeStyle = dpCf.blockStroke;
  ctx[ctxName].lineWidth = dpCf.blockLineWidth;
  ctx[ctxName].fillRect(
    position[0] * dpCf.blockSize,
    position[1] * dpCf.blockSize,
    dpCf.blockSize,
    dpCf.blockSize
  );
  ctx[ctxName].strokeRect(
    position[0] * dpCf.blockSize,
    position[1] * dpCf.blockSize,
    dpCf.blockSize,
    dpCf.blockSize
  );
};

// 中心位置と各相対位置から各ブロック位置を計算するメソッド
export const blocksPos = (position, blocks) => {
  let result = [];
  blocks.forEach((block, i) => {
    result[i] = [position[0] + block[0], position[1] + block[1]];
  });
  return result;
};

export { cnv };
