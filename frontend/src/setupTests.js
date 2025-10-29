// jest-setup.js
require("@testing-library/jest-dom");

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});
