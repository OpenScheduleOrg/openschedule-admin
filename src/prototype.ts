/* eslint-disable */
interface Date {
  addDays(days: number): Date;
  monthSize(month?: number | null, year?: number | null): number;
}

Date.prototype.addDays = function (days) {
  return new Date(this.valueOf() + days * 864e5);
};

Date.prototype.monthSize = function (month = null, year = null) {
  return new Date(year || this.getFullYear(), (month || this.getMonth()) + 1, 0).getDate();
};
