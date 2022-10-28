/* eslint-disable */
interface Date {
  addDays(days: number): Date;
  monthSize(month?: number | null, year?: number | null): number;
  toISODate(): string;
}

Date.prototype.addDays = function (days) {
  return new Date(this.valueOf() + days * 864e5);
};

Date.prototype.monthSize = function (month = null, year = null) {
  return new Date(
    year || this.getFullYear(),
    (month || this.getMonth()) + 1,
    0
  ).getDate();
};

Date.prototype.toISODate = function () {
  return this.toISOString().split("T")[0];
};


Date.prototype.toJSON = function () {
  const tzoffseet = this.getTimezoneOffset();
  this.setMinutes(this.getMinutes() - tzoffseet);
  let isoformat = this.toISOString();
  isoformat = isoformat.replace("Z", "");
  this.setMinutes(this.getMinutes() + tzoffseet);

  return isoformat;
};