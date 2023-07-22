/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
*/

import { prop, props, allPass, equals, partial, pipe, count, compose, min, values, juxt, identical, curry, map, forEach, difference } from 'ramda';

const getCircle = prop('circle');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getStar = prop('star');

const isItRed = partial(equals, ['red']);
const isItOrange = partial(equals, ['orange']);
const isItGreen = partial(equals, ['green']);
const isItBlue = partial(equals, ['blue']);
const isItWhite = partial(equals, ['white']);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
const isSquareGreen = pipe(getSquare, isItGreen);
const isStarRed = pipe(getStar, isItRed);
const isTriangleWhite = pipe(getTriangle, isItWhite);
const isCircleWhite = pipe(getCircle, isItWhite);

const validateN1 = allPass([isCircleWhite, isTriangleWhite, isSquareGreen, isStarRed]);

export const validateFieldN1 = (props) => validateN1(props);

// 2. Как минимум две фигуры зеленые.
const getProps = props(['circle', 'triangle', 'square', 'star']);
const countGreen = partial(count, [isItGreen]);
const minWithTwo = partial(min, [2]);
const isItTwo = partial(equals, [2]);

const validateN2 = pipe(getProps, countGreen, minWithTwo, isItTwo);

export const validateFieldN2 = (props) => validateN2(props);

// 3. Количество красных фигур равно кол-ву синих.
const countRed = partial(count, [isItRed]);
const countBlue = partial(count, [isItBlue]);
const redNum = pipe(getProps, countRed);
const blueNum = pipe(getProps, countBlue);
const getRedBlueNum = juxt([countRed, countBlue]);
const curriedIdentical = curry(identical);
const partialForEach = partial(forEach, [curriedIdentical]);

const validateN3 = pipe(values, getRedBlueNum, difference);

export const validateFieldN3 = (props) => {
  console.log(validateN3(props));
  
  return false;
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
const isCircleBlue = pipe(getCircle, isItBlue);
const isSquareOrange = pipe(getSquare, isItOrange);

const validateN4 = allPass([isCircleBlue, isSquareOrange, isStarRed]);

export const validateFieldN4 = (props) => validateN4(props);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
const countOrange = partial(count, [isItOrange]);
const isItFour = partial(equals, [4]);

const validateN7 = pipe(getProps, countOrange, isItFour);

export const validateFieldN7 = (props) => validateN7(props);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
const validateN9 = pipe(getProps, countGreen, isItFour);

export const validateFieldN9 = (props) => validateN9(props);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = () => false;
