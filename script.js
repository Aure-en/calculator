/*Main Elements*/

let calculator = document.querySelector(".calculator__main");

/*Functions*/

    /*Input related functions*/

let operation = '';
let display = '';
let result = 0;

function input(event) {

    if (event.target.tagName != 'LI') return;

        //Clear
    if (event.target.innerHTML == 'AC') {
        clear();
        return;
    }

        //Erase
    if (event.target.innerHTML == '🡐') {
        erase();
        return;
    }


        //Default
    operation += event.target.innerHTML;  
    fixInput();
    displayOperation(operation);

        //Equal
    if (event.target.innerHTML == '=') {

        if (!checkOperation(operation)) {
            displayResult("Error: cannot divide by 0.");
            result = 0;
            return;
        }

        if (/[+÷✕‒%]=$/.test(operation)) {
            operation = operation.slice(0, operation.length - 1);
            return;
        }

        calculate(operation);
        operation = '';
        displayResult(result);
        
    }    

}

function erase() {
    return operation = operation.slice(0, operation.length - 1);
}

function clear() {
    operation = '';
    result = '';
    displayResult(result);
}

function fixInput() {

    operation = operation.replace(/[+÷✕‒%]+([+÷✕‒%])/g, '$1')
        .replace(/^([+÷✕‒%])/, `${result}$1`) // A lone operator is replaced by result, followed by the operator.
        .replace(/(^|[+÷✕‒%])\./, '$10.') // '.' is replaced by "0."
        .replace(/\b0\.([+÷✕‒%])/, '0$1') // "0.", followed by an operator, is replaced by "0"
        .replace(/(\d+\.(\d+)?)\./, '$1') // Only allows one '.' per number.
        .replace(/(^|\b)0+\./, '0.') // Multiple "0" before a . are replaced by only one "0".
        .replace(/([+÷✕‒%])\./, '$1',) // A "." following an operator is replaced by "0."
        .replace(/(^|[+÷✕‒%])0+([0-9])/, '$1$2') // If there are some "0" before a number, they are deleted.
        .replace(/0\.=/, '0=') // If "=" follows "0.", it is replaced by "0".

}

function convertInput(operation) {
    return operation.replace(/[‒±]/g, '-')
        .replace(/÷/g, '/')
        .replace(/✕/g, '*');
}

    /*Display related functions*/

function displayOperation(operation) {
    display = operation.replace(/\//g, '÷')
        .replace(/\*/g, '✕')
        .replace(/\-/g, '‒')
        .replace(/±/g, '-')
        .replace(/([+÷✕‒%=])/g, ' $1 ');
    document.querySelector('.calculator__display_operation').innerHTML = display;     
}

function displayResult(result) {

    if (result > 100000000) {
        
        if (/\./.test(result)) {
            result = Number(result).toExponential(5);
        } else {
            result = Number(result) .toExponential(5);
        }

    }

    if (result.toString().length > 10) {
        result = Number(result).toFixed(5);
    }

        document.querySelector('.calculator__display_result').innerHTML = result;
}

    /*Calculations related functions*/

function checkOperation(operation) {
    if (/÷0(\b|$)/.test(operation)) {
        return false;
    }
    return true;
}

function calculate(operation) {

    result = convertInput(operation).slice(0, convertInput(operation).length - 1);

    while (!/^-?\d+(\.\d+)?$/.test(result)) {
        result = result.replace(/((?:-?\d+)(?:\.\d+)?)([-+/*%])((?:-?\d+)(?:\.\d+)?)/, (match, a, operator, b) => operate(+a, +b, operator));
    }

    return result;

}

function operate(a, b, operator) {
    if (operator == '+') return add(a, b);
    if (operator == '-') return substract(a, b);
    if (operator == '*') return multiply(a, b);
    if (operator == '/') return divide(a, b);
    if (operator == '%') return modulo(a, b);
}

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b == 0) return "Cannot divide by 0.";
    return a / b;
}

function modulo(a, b) {
    return a % b;
}

/*Event Listeners*/

calculator.addEventListener("click", input);