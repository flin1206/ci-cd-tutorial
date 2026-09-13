const { add, subtract, multiply, divide } = require("../src/calculator");

test("加法:2 + 3 應該等於 5", () => {
  expect(add(2, 3)).toBe(5);
});

test("減法:5 - 3 應該等於 2", () => {
  expect(subtract(5, 3)).toBe(2);
});

test("乘法:4 * 3 應該等於 12", () => {
  expect(multiply(4, 3)).toBe(12);
});

test("除法:10 / 2 應該等於 5", () => {
  expect(divide(10, 2)).toBe(5);
});

test("除以 0 應該要丟出錯誤", () => {
  expect(() => divide(10, 0)).toThrow("除數不能是 0");
});
