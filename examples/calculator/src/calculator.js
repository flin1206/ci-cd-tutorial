/**
 * 一個非常簡單的計算機函式庫,用來示範 CI(持續整合)如何自動測試程式碼。
 * 對應教學文件:docs/07-在CI中測試.md
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("除數不能是 0");
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
