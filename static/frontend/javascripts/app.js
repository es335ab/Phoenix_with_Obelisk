import additionCalculator from 'modules/additionCalculator';
import taxCalculator from 'modules/taxCalculator';
import tinymce from 'tinymce';

const item1Price = 400;
const item2Price = 600;
const totalPrice = additionCalculator(item1Price, item2Price);
const tax = 1.08;
const priceIncludeTax = taxCalculator(totalPrice, tax);

console.log(priceIncludeTax);
console.log(tinymce);
