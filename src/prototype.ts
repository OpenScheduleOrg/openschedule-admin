/* eslint-disable */ 
interface Date{
    addDays(days: number): Date 
}

Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf() + (days * 864e+5));
    return date;
}