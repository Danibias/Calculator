/**
 * BASIC FUNCTIONS
 */

const operations = {
    '+': (a,b) => a + b,
    '-': (a,b) => a - b,
    '*': (a,b) => a * b,
    '/': (a,b) => (b === 0 ? "Can't divide by 0": a / b)
};

const operate = (operator, num1, num2) => {
    const operation = operations[operator];
    return operation ? operation(num1, num2) : "Invalid operator";
}

// Stores what's shown on the calculator screen
let displayValue = "";
let firstNumber = null;
let operator = null;
let secondNumber = null;

const display = document.querySelector(".display");

const updateDisplay = () => {
    display.textContent = displayValue || "0"; // show 0 if empty
}

const digits = document.querySelectorAll(".digit");

digits.forEach(button => {
    button.addEventListener("click", () => {
        const digit = button.textContent;
        // show numeric characters only
        if (!isNaN(digit) || digit === ".") {
            displayValue += digit;
            updateDisplay();
        }
    });
});

// clear buttons
document.getElementById("clearAll").addEventListener("click", () => {
    displayValue = "";
    display.textContent = 0;
});


