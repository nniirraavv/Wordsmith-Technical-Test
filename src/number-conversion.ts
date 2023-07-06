// Pre-defined arabic to roman numeric mapping
const arabicRomanMapping: Map<number, string> = new Map([
    [ 1000, 'M'],
    [ 900, 'CM'],
    [ 500, 'D'],
    [ 400, 'CD'],
    [ 100, 'C'],
    [ 90, 'XC'],
    [ 50, 'L'],
    [ 40, 'XL'],
    [ 10, 'X'],
    [ 9, 'IX'],
    [ 5, 'V'],
    [ 4, 'IV'],
    [ 1, 'I']
]);

// Function to convert number to roman numerical string
export default function arabicToRoman(n: number): string {
    let result = '';
    for (let [arabicValue, romanSymbol] of arabicRomanMapping) {
        while (n >= arabicValue) {
            result += romanSymbol;
            n -= arabicValue;
        }
    }
    return result;
}

// console.log(arabicToRoman(1)); // I
// console.log(arabicToRoman(2)); // II
// console.log(arabicToRoman(3)); // III
// console.log(arabicToRoman(4)); // IV
// console.log(arabicToRoman(5)); // V
// console.log(arabicToRoman(6)); // VI
// console.log(arabicToRoman(7)); // VII
// console.log(arabicToRoman(8)); // VIII
// console.log(arabicToRoman(9)); // IX
// console.log(arabicToRoman(10)); // X
// console.log(arabicToRoman(49)); // XLIX
// console.log(arabicToRoman(3999)); // MMMCMXCIX