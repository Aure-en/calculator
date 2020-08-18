/*Main Elements*/

let calculator = document.querySelector(".calculator__main");

/*Functions*/

    /*Input-related functions*/

let operation = '';
let display = '';
let result = 0;

function input(event) {

    if (event.target.tagName != 'LI') return;

    switch (event.target.innerHTML) {

        case 'AC':
            operation = '';
            break;
    
        case '🡐':
            operation = operation.slice(0, operation.length - 1);
            break;
    
        case '÷':
            operation += '/';
            break;
    
        case '✕':
            operation += '*';
            break;
    
        case '‒':
        case '±':
            operation += '-';
            break;

        default:
            operation += event.target.innerHTML;
    
    }
}

function checkInput(event) {

    if (operation == '' && event.target.innerHTML.match(/[-*/+]/)) {
        operation = result + event.target.innerHTML;
    }

    if (operation.match(/[-*/+]$/)) {
        operation.replace(/[-*/+]$/, event.target.innerHTML);
    }

    if (operation.match(/\d+\.\d*$/) && event.target.innerHTML == '.') return;
}

function displayOperation(operation) {
    display = operation.replace(/\//g, '÷')
        .replace(/\*/g, '✕')
        .replace(/\-/g, '‒')
        .replace(/([+÷✕‒])/g, ' $1 ');
    document.querySelector('.calculator__display_operation').innerHTML = display;     
}

function displayResult(result) {
    document.querySelector('.calculator__display_result').innerHTML = result;
}

    /*Operations-related functions*/

function calculate(operation) {

    result = operation;

    while (!/^-?\d+$/.test(result)) {
        result = result.replace(/(\d+)([-+/*])(\d+)/, (match, a, operator, b) => operate(+a, +b, operator));
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
calculator.addEventListener("click", () => displayOperation(operation));
document.querySelector('.calculator__operators_equal').addEventListener("click", () => {
    calculate(operation);
    displayResult(result) });