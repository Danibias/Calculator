/**
 * BASIC FUNCTIONS
 */

// Add
const add = (...numbers) => {
    return numbers.reduce((total, num) => total + num, 0);
}
 
// Subtract
const subtract = (...numbers) => {
    return numbers.reduce((total, num) => total - num, 0);
}

// Multiply
const multiply = (...numbers) => {
    return numbers.reduce((total, num) => total * num, 1);
}

// Divide
const divide = (...numbers) => {
    return numbers.reduce((total, num) => total / num, 1);
}