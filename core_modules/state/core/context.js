// context.js
let _currentEffect = null;

export const currentEffect = {
  get: () => _currentEffect,
  set: (value) => { _currentEffect = value; }
};