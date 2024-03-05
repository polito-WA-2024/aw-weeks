"use string";

const userNames = `Luigi De Russis, Luca Mannella, Fulvio Corno, 
Juan Pablo Saenz Moreno, 
Enrico Masala, Antonio Servetti `;

const modif = userNames;

const names = modif.split(',');
//console.log(names);

// clean whitespace around commas
for (let i = 0; i < names.length; i++) {
    names[i] = names[i].trim();
}
console.log(names);

// compute acronyms
const acronyms = [];
for (const name of names) {
    let s = name[0].toUpperCase();
    for (let i = 1; i < name.length; i++) {
        if (name[i - 1] === ' ') {
            s = s + name[i].toUpperCase();
        }
    }
    acronyms.push(s);
}

console.log(acronyms);
