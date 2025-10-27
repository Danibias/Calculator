/**
 * Basic functions
 */

const operations = {
    '+': (a,b) => a + b,
    '-': (a,b) => a - b,
    '*': (a,b) => a * b,
    '/': (a,b) => (b === 0 ? NaN : a / b)
};

const operate = (operator, num1, num2) => {
    const operation = operations[operator];
    return operation ? operation(num1, num2) : "Invalid operator";
}

/**
 * Display
 */

// Stores what's shown on the calculator screen
let displayValue = "";
let firstNumber = null;
let operator = null;
let secondNumber = null;

const display = document.querySelector(".display");

// show 0 if empty
const updateDisplay = () => {
    display.textContent = displayValue || "0"; 
}

const digits = document.querySelectorAll(".digit");

// show numeric characters only
digits.forEach(button => {
    button.addEventListener("click", () => {
        const digit = button.textContent;
        if (digit === "." && displayValue.includes(".") || digit === "=")return; 
        {
            displayValue += digit;
            updateDisplay();
        }
    });
});

/**
 * Clear buttons
 */

document.getElementById("clearAll").addEventListener("click", () => {
    displayValue = "";
    firstNumber = null;
    operator = null;
    secondNumber = null;
    updateDisplay();
});

document.getElementById("delete").addEventListener("click", () => {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
});

/**
 * Operators
 */

const operators = document.querySelectorAll(".operator");
const equals = document.getElementById("equals");

operators.forEach(button => {
    button.addEventListener("click", () => {
        const newOperator = button.textContent;

        //if first number not set, store current display value
        if (firstNumber === null) {
            firstNumber = parseFloat(displayValue);

        // If operator already exists, perform the previous operation first
        } else if (operator) {
            secondNumber = parseFloat(displayValue);
            const result = operate(operator, firstNumber, secondNumber);
            displayValue = result.toString();
            
            // chain result as next first number
            firstNumber = result; 
            updateDisplay();
        }
        // Store new operator
        operator = newOperator;
        // reset screen for next input
        displayValue = ""; 
    });
});

equals.addEventListener("click" , () => {
    if (operator && firstNumber!== null && displayValue !== "") {
        secondNumber = parseFloat(displayValue);
        const result = operate(operator, firstNumber, secondNumber);
        displayValue = result.toString();
        updateDisplay();

        // Reset state for next operation
        firstNumber =  result;
        operator = null;
        secondNumber =null;
    }
});

