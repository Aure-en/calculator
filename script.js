/*Main Elements*/

let calculator = document.querySelector(".calculator__main");

/*Functions*/

    /*Input related functions*/

let operation = '';
let display = '';
let result = 0;

function input(event) {

    if (event.target.tagName != 'LI') return;
    
    //If we start with an operator, the calculator uses the previous result as the first operande.
    if (operation == '' && event.target.innerHTML.match(/[+÷✕‒%]/)) {
        operation = result + event.target.innerHTML;
        return;
    }

    //If we already have an operator but press on another operator, it replaces the old one.
    if (/[+÷✕‒%]$/.test(operation) && event.target.innerHTML.match(/[+÷✕‒%]/)) {
        operation = operation.replace(/[+÷✕‒%]$/, event.target.innerHTML);
        return;
    }

    //If we have 0. and press on an operator, it is replaced by 0.
    if (/0\.$/.test(operation) && event.target.innerHTML.match(/[+÷✕‒%]/)) {
        operation = operation.replace(/0\.$/, 0 + event.target.innerHTML);
        return;
    }

    //If our operande already has a '.', we cannot add another one.
    if (/\d+\.\d*$/.test(operation) && event.target.innerHTML == '.') return;

    //If we start a new operation, it replaces the previous one.
    if (/=$/.test(operation) && /[±0-9]/.test(event.target.innerHTML)) {
        operation = event.target.innerHTML;
        return;
    }

    if (/=$/.test(operation) && event.target.innerHTML == '.') {
        operation = 0 + event.target.innerHTML;
        return;
    }

    if (/=$/.test(operation) && /[+÷✕‒%]/.test(event.target.innerHTML)) {
        operation = result + event.target.innerHTML;
        return;
    }

    //If we press several 0 in a row before any '.', they are ignored.
    if (event.target.innerHTML == '0' && /\b0$/.test(operation)) return;

    //If we press '.' without any digit before it, a 0 is added.
    if (event.target.innerHTML == '.' && (/[+÷✕‒%]$/.test(operation) || operation == '') ) {
        operation += 0 + event.target.innerHTML;
        return;
    }

    //Pressing special keys :

        //Clear
    if (event.target.innerHTML == 'AC') {
        operation = '';
        result = '';
        displayResult(result);
        return;
    }

        //Erase
    if (event.target.innerHTML == '🡐') {
        operation = operation.slice(0, operation.length - 1);
        return;
    }

        //Equal
    if (event.target.innerHTML == '=') {


        if (/=/.test(operation)) return;
        if (/[+÷✕‒%]$/.test(operation)) return;
        if (/\.$/.test(operation)) operation += 0;
        console.log((/0\.$/.test(operation)));
        if (/0\.0$/.test(operation)) {
            console.log(operation);
            operation = operation.replace(/0\.0$/, `0${event.target.innerHTML}`);
            console.log(operation);
        }

        if (!checkOperation(operation)) {
            displayResult("Error: cannot divide by 0.");
            return;
        }

        calculate(operation);
        displayResult(result);
        
    }    

    //If there is a lone 0, it is replaced.
    if (/\b0$/.test(operation)) {
        operation = operation.replace(/\b0$/, event.target.innerHTML);
        return;
    }

    //Default
    operation += event.target.innerHTML;    

}

function convertInput(operation) {
    return operation.replace(/[‒±]/g, '-')
        .replace(/÷/g, '/')
        .replace(/✕/g, '*')
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
        document.querySelector('.calculator__display_result').innerHTML = result;
}

    /*Calculations related functions*/

function checkOperation(operation) {
    if (/÷0\b/.test(operation)) {
        return false;
    }
    return true;
}

function calculate(operation) {

    result = convertInput(operation);

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
calculator.addEventListener("click", () => displayOperation(operation));