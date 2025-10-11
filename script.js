/**
 * BASIC FUNCTIONS
 */

// // Add
// const add = (...numbers) => {
//     return numbers.reduce((total, num) => total + num, 0);
// }
 
// // Subtract
// const subtract = (...numbers) => {
//     return numbers.reduce((total, num) => total - num, 0);
// }

// // Multiply
// const multiply = (...numbers) => {
//     return numbers.reduce((total, num) => total * num, 1);
// }

// // Divide
// const divide = (...numbers) => {
//     return numbers.reduce((total, num) => total / num, 1);
// }

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