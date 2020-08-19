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
            operation = '';
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
    result = 0;
    displayResult(result);
    displayOperation(operation);
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

    /*Calculator display related functions*/

function displayOperation(operation) {
    display = operation.replace(/\//g, '÷')
        .replace(/\*/g, '✕')
        .replace(/\-/g, '‒')
        .replace(/±/g, '-')
        .replace(/([+÷✕‒%=])/g, ' $1 ');
    document.querySelector('.calculator__display_operation').innerHTML = display;     
}

function displayResult(result) {

    console.log(result);

    if (result > 100000000) {
        
        if (/\./.test(result)) {
            result = Number(result).toExponential(5);
        } else {
            result = Number(result) .toExponential(5);
        }

    }

    if (/\.\d{6,}$/.test(result)) {
        result = Number(result).toFixed(5);
    }

        document.querySelector('.calculator__display_result').innerHTML = result;
}

    /*Calculations related functions*/

let pemdas = false;
let number = '-?\\d+(?:\\.\\d+)?(?:e\\+\\d+)?';

function checkOperation(operation) {
    if (/÷0(\b|$)/.test(operation)) {
        return false;
    }
    return true;
}

function calculate(operation) {

    result = convertInput(operation).slice(0, convertInput(operation).length - 1);

    //If PEMDAS is used, the '*', '/' and '%' happen before the '+' and '-'.
    if (pemdas) {
        result = applyPEMDAS(result);
    }

    while (!new RegExp(`^${number}$`).test(result)) {
        result = result.replace(new RegExp(`(${number})([-+*/%])(${number})`), (match, a, operator, b) => operate(+a, +b, operator));
    }

    return result;

}

function applyPEMDAS(operation) {

    return operation.replace(new RegExp(`(${number})([*/%])(${number})`), (match, a, operator, b) => operate(+a, +b, operator));

}

function togglePEMDAS() {
    pemdas = !pemdas;
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

    /*General display related functions*/

let calculator = document.querySelector(".calculator__main");
let calculatorWindow = document.querySelector('.calculator__window');
let calculatorMain = document.querySelector('.calculator__main');
let prevX;
let prevY;

function maximize() {
    if (!calculatorWindow.classList.contains('maximize')) {
        prevX = calculatorWindow.style.left;
        prevY = calculatorWindow.style.top;
        console.log(prevX, prevY);
        calculatorWindow.style.left = 0;
        calculatorWindow.style.top = 0;
    } else {
        calculatorWindow.style.left = prevX;
        calculatorWindow.style.top = prevY;
    }

    calculatorWindow.classList.toggle('maximize');
    calculatorMain.classList.toggle("maximize");
    calculatorWindow.classList.remove("minimize");
    calculatorMain.classList.remove("minimize");

}

function minimize() {
    calculatorWindow.classList.toggle("minimize");
    calculatorMain.classList.toggle("minimize");
    calculatorWindow.classList.remove("maximize");
    calculatorMain.classList.remove("maximize");
    calculatorWindow.style.left = prevX;
    calculatorWindow.style.top = prevY;

}

function drag(event) {
    let shiftX = event.clientX - calculatorWindow.getBoundingClientRect().left;
    let shiftY = event.clientY - calculatorWindow.getBoundingClientRect().top;
    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {

        let left = pageX - shiftX;
        if (left < 0) left = 0;
        if (left > document.documentElement.clientWidth - calculatorWindow.offsetWidth) left = window.clientWidth - calculatorWindow.offsetWidth;

        let top = pageY - shiftY;
        if (top < 0) top = 0;
        if (top > document.documentElement.clientHeight - calculatorWindow.offsetHeight) top = document.documentElement.clientHeight - calculatorWindow.offsetHeight;

        calculatorWindow.style.left = left + 'px';
        calculatorWindow.style.top = top + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        prevX = calculatorWindow.style.left;
        prevY = calculatorWindow.style.top;
    }

    document.addEventListener("mousemove", onMouseMove);
    document.onmouseup = function() {
        document.removeEventListener("mousemove", onMouseMove);
        document.onmouseup = null;
    }

}

function replaceCalculator(event) {

    let left = parseInt(calculatorWindow.style.left);
    if (left < 0) left = 0;
    if (left > document.documentElement.clientWidth - calculatorWindow.offsetWidth) left = document.documentElement.clientWidth - calculatorWindow.offsetWidth;

    let top = parseInt(calculatorWindow.style.top);
    if (top < 0) top = 0;
    if (top > document.documentElement.clientHeight - calculatorWindow.offsetHeight) top = document.documentElement.clientHeight - calculatorWindow.offsetHeight;

    calculatorWindow.style.left = left + 'px';
    calculatorWindow.style.top = top + 'px';

}

/*Event Listeners*/

    //Input operators/operandes when pressing keys
calculator.addEventListener("click", input);

    //Prevent the text from being selected when pressing keys
document.querySelectorAll('li').forEach( li => li.onmousedown = function(e) { e.preventDefault(); });

    //Resize calculator
document.querySelector('#pemdas').addEventListener("change", togglePEMDAS);
document.querySelector('.calculator__menu_maximize').addEventListener("click", maximize);
document.querySelector('.calculator__menu_minimize').addEventListener("click", minimize);
document.querySelector('.calculator__header').addEventListener("dblclick", function(event) {
    if (event.target.closest('li')) return;
    maximize();
});

    //Move the calculator
document.querySelector('.calculator__header').addEventListener("mousedown", drag);
calculatorWindow.ondragstart = function() { return false; };

    //Replace the calculator when the window is resized.
window.addEventListener("resize", replaceCalculator);
