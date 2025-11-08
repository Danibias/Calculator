/** Globals */

// Stores what's shown on the calculator screen
let displayValue = "";
let firstNumber = null;
let operator = null;
let secondNumber = null;
const maxDigits = 9;
let shouldResetDisplay = false;
let justEvaluated = false;

/**
 * Basic functions
 */

const operations = {
    '+': (a,b) => a + b,
    '-': (a,b) => a - b,
    '*': (a,b) => a * b,
    '/': (a,b) => (b === 0 ? "Error" : a / b)
};

// operate
const operate = (operator, num1, num2) => {
    const operation = operations[operator];
    return operation ? operation(num1, num2) : "Invalid operator";
}

// rounds a number

const roundTo = (num, decimals = 2, mode = "round") => {
    const factor = Math.pow(10, decimals);

    switch (mode) {
        case "floor":
            return Math.floor(num * factor) / factor;
            
        case "ceil":
            return Math.ceil(num * factor) / factor;
        
        default:
            return Math.round(num * factor) / factor;
    };
};

/** 
 * Display
 */

const display = document.querySelector(".display");

// incomplete input cases
const toNumber = (value) => {
  if (value === "" || value === "." || value === "-") return 0;
  const input = parseFloat(value);
  return Number.isFinite(input) ? input : 0;
};


// show 0 if empty
const updateDisplay = () => {
    display.textContent = displayValue || "0";
}

/**
 * Digits
 */

const digits = document.querySelectorAll(".digit");

digits.forEach(button => {
    button.addEventListener("click", () => {

        // clear error state on new input
        if (display.classList.contains("error")) {
            display.classList.remove("error");
            displayValue = "";
        }

        // if a digit comes right after " = ", start a new calculation.
        if (shouldResetDisplay) {
            displayValue = "";
            shouldResetDisplay = false;
        }
        // pressing any digit after " = " forgets the previous result.
        if (justEvaluated) {
            firstNumber = null;
            operator = null;
            secondNumber = null;
            justEvaluated = false;
        }
        // show numeric characters only
        const digit = button.textContent;
        if ((digit === "." && displayValue.includes(".")) || digit === "=")return; 

        // Count and show only 9 digits on the screen,ignoring the decimal point and sign.
        const digitCount = displayValue.replace(/[^0-9]/g, "").length;
        if (digitCount >= maxDigits) return;

        // update the display
        displayValue += digit;
        updateDisplay();
    });
});

/**
 * Operators
*/

const operators = document.querySelectorAll(".operator");

operators.forEach(button => {
    button.addEventListener("click", () => {
        const newOperator = button.textContent;
        
        // block operator press if  there's no number on the screen.
        if (displayValue === "" || displayValue === ".") return; 
        
        // if operator is pressed right after " = ", reuse the shown result
        if (justEvaluated) {
            operator = newOperator;
            shouldResetDisplay = true;
            justEvaluated =  false;
            return;
        }      
        
        //if first number not set, store current display value
        if (firstNumber === null) {
            firstNumber = toNumber(displayValue);
            operator = newOperator;
            shouldResetDisplay = true;
            return;
            
        // If operator already exists, perform the previous operation first
        } else if (operator) {
            secondNumber = toNumber(displayValue);
            let result = operate(operator, firstNumber, secondNumber);

            // overflow control
            if (result > 1e9) {
                displayValue = "Overflow";
                display.classList.add("error");
                updateDisplay();
                resetCalculator(false);
                return;
            }
            // error handling
            if (typeof result === "string") {
                displayValue = result;
                display.classList.add("error");     
                updateDisplay();
                resetCalculator(false);
                return;
            }

            // round chained result
            result = roundTo(result, 2, "round");

            displayValue = result.toString();
            firstNumber = result;
            updateDisplay();           
            
        }
        
        // Store new operator
        operator = newOperator;
        // reset screen for next input
        displayValue = ""; 
    });
});

const equals = document.getElementById("equals");

equals.addEventListener("click" , () => {
    
    if (operator && firstNumber!== null && displayValue !== "") {
        secondNumber = toNumber(displayValue);
        let result = operate(operator, firstNumber, secondNumber);
        
        if (typeof result === "string") {
            // error handling
            displayValue = result;
            display.classList.add("error");
            updateDisplay();
            resetCalculator(false);
            return;
        }

        // round 2 decimals before displaying
        if (typeof result === "number" && !isNaN(result)) {
            result = roundTo(result, 2, "round");
        }
        
        displayValue = result.toString();
        updateDisplay();
        
        // Reset state for next operation
        firstNumber =  result;
        operator = null;
        secondNumber =null;
        
        // pressing any digit should clear the screen and start fresh.
        shouldResetDisplay = true;
        justEvaluated = true;
        
    } else {
        displayValue = "Error";
        display.classList.add("error");
        updateDisplay();
        resetCalculator(false);
        return;
    }
});

/**
 * Functions
 */

// Square root
const square = document.getElementById("square");

square.addEventListener("click" , () => {

    if (displayValue === "" || displayValue === "." || displayValue === "-") return;
    const num = toNumber(displayValue);
    let result = num * num;

    // overflow control
    if (result > 1e9) {
    displayValue = "Overflow";
    display.classList.add("error");
    updateDisplay();
    resetCalculator(false);
    return;
    }

    const rounded = roundTo(result, 2, "round");

    displayValue = rounded.toString();
    updateDisplay();

    // reset state
    firstNumber = rounded;
    operator = null;
    secondNumber = null;
    shouldResetDisplay = true;
    justEvaluated = true;
});

// Percentage
const percent = document.getElementById("percent");

percent.addEventListener("click", () => {
    if (displayValue === "" || displayValue === "." || displayValue === "-") return;
    
    const current = toNumber(displayValue);

    // If there's a first number and an operator, make % relative to it.
    if (firstNumber !== null && operator) {
        const percentValue =(firstNumber * current) / 100;
        displayValue = roundTo(percentValue, 4, "round").toString();

    // divide by 100
    } else {
        displayValue = roundTo(current / 100, 4, "round").toString();
    }
    updateDisplay();
    shouldResetDisplay = false;
});

// Plus / minus toggle
const plusMinus = document.getElementById("sign");

plusMinus.addEventListener("click", () => {

    // prevent toggling during error
    if (display.classList.contains("error")) {
        resetCalculator(false)
        display.classList.remove("error");
        return;
    }

    // if nothing to toggle
    if (displayValue === "" || displayValue === ".") return;
    
    // Convert to a number and round it
    const num = toNumber(displayValue);
    const toggled = -num;

    const rounded = roundTo(toggled, 4, "round");
    
    displayValue =rounded.toString();
    updateDisplay();

});

/**
 * Reseter
*/

const resetCalculator = (full = false) => {
    displayValue = "";
    firstNumber = null;
    operator = null;
    secondNumber = null;
    shouldResetDisplay = false;
    justEvaluated = false;
    
    display.classList.remove("error");
    // update only if  it's a full reset
    if (full) updateDisplay(); {
    }
}

/**
 * Clear buttons
 */

document.getElementById("clearAll").addEventListener("click", () => {
    resetCalculator(true);
});

document.getElementById("delete").addEventListener("click", () => {
    displayValue = displayValue.slice(0, -1);
    if (displayValue === "." || displayValue === "-") {
        displayValue = "";
    }
    updateDisplay();
});

/**
 * Keyboard support
 */

window.addEventListener("keydown", (e) => {
    const key = e.key;
    
    if (key === "Enter" || key === "backspace") e.preventDefault();

    let btn = document.querySelector(`[data-key = "${key}"]`);

    if (!btn) {
        if (key === "=") btn = document.querySelector(`[data-key = "Enter"]`);
    }

    if(btn) btn.click();
});

