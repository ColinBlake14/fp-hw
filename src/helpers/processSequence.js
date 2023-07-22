/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';
 import { allPass, tap, length, partial, lt, pipe, lte, test, gt, applySpec, add, always, andThen, pick, prop } from 'ramda';


 const api = new Api();

 /**
  * Я – пример, удали меня
  */
 const wait = time => new Promise(resolve => {
     setTimeout(resolve, time);
 })

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    // writeLog
    const writeLogFn = tap(writeLog);

    // validate
    const moreTnanTwo = partial(lt, [2]);
    const lengthMoreThanTwo = pipe(length, moreTnanTwo);
    
    const lessTnanTen = partial(gt, [10]);
    const lengthLessThanTen = pipe(length, lessTnanTen);
    
    const moreThanZero = partial(lt, [0]);
    const numIsMoreThanZero = pipe(Number, moreThanZero);
    
    const testReg = test(/^\d+(\.\d+)?$/);
    
    const validateFn = allPass([lengthMoreThanTwo, lengthLessThanTen, numIsMoreThanZero, testReg]);

    // convert
    const convertFn = pipe(parseFloat, Math.round, String);

    // getObject
    const getObject = applySpec({
        from: always(10),
        to: always(2),
        number: convertFn
    });

    // async query
    const getFn = api.get('https://api.tech/numbers/base');
    const getNumOfSymb = pipe(getObject, tap(console.log), getFn, andThen(prop('result')));


    // BEGIN
    writeLogFn(value);

    getNumOfSymb(value).then(writeLogFn);

    wait(2500).then(() => {
        writeLog('SecondLog')

        return wait(1500);
    }).then(() => {
        writeLog('ThirdLog');

        return wait(400);
    }).then(() => {
        handleSuccess('Done');
    });
}

export default processSequence;
