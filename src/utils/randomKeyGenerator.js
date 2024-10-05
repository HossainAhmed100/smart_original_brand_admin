import { numbersList, symbolsList, wordsList } from "./words";

const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)];

export const generateRandomKey = () => {
  const key = [];
  for (let i = 0; i < 4; i++) {
    key.push(getRandomItem(wordsList));
    key.push(getRandomItem(numbersList));
    key.push(getRandomItem(symbolsList));
  }
  return key.join('');
};
