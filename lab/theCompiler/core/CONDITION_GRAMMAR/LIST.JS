
1. Boolean Literals DONE**********

if (true) {
  console.log("This is true");
}

2. Comparisons DONE**********


if (a == b) {
  console.log("Equal values");
}


if (a === b) {
  console.log("Equal values and types");
}

3. Logical Operators DONE**********


if (a > 0 && b < 10) {
  console.log("Both conditions are true");
}
if (a > 0 || b < 10) {
  console.log("At least one condition is true");
}



4. Arithmetic Comparisons:

if ((a + b) > 10) {
  console.log("Sum is greater than 10");
}



5. Type Checks DONE**********

if (typeof a === 'string') {
  console.log("a is a string");
}

5b. DONE**********

if (a instanceof Array) {
  console.log("a is an array");
}



6. Object Property  Checks DONE**********

if ('property' in obj) {
  console.log("Property exists in object");
}


 DONE ********
if (obj.hasOwnProperty('property')) {
  console.log("Property exists in object");
}



7. Nullish Coalescing DONE ********

let value = null;
if ((value ?? 'default') === 'default') {
  console.log("Value is null or undefined");
}




8. Optional Chaining DONE ********

if (obj?.property) {
  console.log("Property exists and is truthy");
}




9. Ternary Operator ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

let result = a > b ? "a is greater" : "b is greater or equal";
if (result) {
  console.log(result);
}




10. Function Calls DONE********** 

if (isAvailable()) {
  console.log("Item is available");
}




11. String Comparisons: DONE********** 

if (str1 === str2) {
  console.log("Strings are equal");
}




12. Array and Object Checks: DONE**********

if (array.length > 0) {
  console.log("Array is not empty");
}




13. Bitwise Operators DONE**********

if ((flags & 1) !== 0) 

{
  console.log("First bit is set");
}


                             DONE**********
14. Regular Expressions

if (/test/.test(string)) {
  console.log("String contains 'test'");
}

                             DONE**********
if (input.match(regex)) {
  console.log("String contains 'test'");
}

































