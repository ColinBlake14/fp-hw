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
 import { 
    allPass, 
    tap, 
    length, 
    partial, 
    lt, 
    pipe,  
    test, 
    gt, 
    applySpec,  
    always, 
    andThen, 
    prop, 
    ifElse, 
    modulo, 
    __, 
    partialRight 
} from 'ramda';


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
    const getNumOfSymb = pipe(getObject, getFn, andThen(prop('result')));

    // countLengthFn
    const countLengthFn = pipe(length, writeLogFn);

    // mod3Fn
    const mod3Fn = modulo(__, 2);
    const mod3FnPipeline = pipe(mod3Fn, writeLogFn);
    
    // pow2Fn
    const pow2Fn = partialRight(Math.pow, [2]);
    const pow2FnPipeline = pipe(pow2Fn, writeLogFn);

    // stringConstructFn
    const stringConstructFn = (id) => `https://animals.tech/${id}`;

    // call animals.tech
    const getAnimalFn = partialRight(api.get, [{}]);

    const getAnimalPipeline = pipe(stringConstructFn, getAnimalFn, andThen(prop('result')), andThen(handleSuccess));

    // main pipeline
    const mainPipeline = pipe(
        convertFn, 
        getNumOfSymb, 
        andThen(writeLogFn), 
        andThen(countLengthFn),
        andThen(pow2FnPipeline), 
        andThen(mod3FnPipeline),
        andThen(getAnimalPipeline)
    );

    // validateErrorFn
    const validateErrorFn = partial(handleError, ['ValidationError']);

    // validateFn
    const validateFn = ifElse( 
        allPass([lengthMoreThanTwo, lengthLessThanTen, numIsMoreThanZero, testReg]),
        mainPipeline,
        validateErrorFn
    )

    const validatePipeline = pipe(writeLogFn, validateFn);

    // BEGIN
    validatePipeline(value);
}

export default processSequence;
