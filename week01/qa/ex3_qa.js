"use strict";

// import (using name of my choice)
const dayjs = require ('dayjs');

// use (depends on the specific package)
let now = dayjs();
console.log(now.format());

function Question(text, questioner, date) {
    this.text = text;
    this.questioner = questioner;
    this.date = date;
    this.list = [];

    this.add = (ans) => {
        this.list.push(ans);
    }

    this.str = function() { return `${this.text} asked by ${this.questioner} on ${this.date.format("YYYY-MM-DD")}`};
}

const q = new Question("Best way of enumerating an array in JS?", 'Enrico', 
    dayjs('2024-03-07')
);
console.log(q.str());

