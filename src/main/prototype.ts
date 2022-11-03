/* eslint-disable */
interface Date {
  addDays(days: number): Date;
  monthSize(month?: number | null, year?: number | null): number;
  toISODate(): string;
}

interface String {
  maskCnpj(): string;
  maskCpf(): string;
  maskPhone(): string;
  removeMask(): string;
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

String.prototype.maskCpf = function () {
  return (
    this.slice(0, 3) +
    "." +
    this.slice(3, 6) +
    "." +
    this.slice(6, 9) +
    "-" +
    this.slice(9, 11)
  );
};

String.prototype.maskCnpj = function () {
  return (
    this.slice(0, 2) +
    "." +
    this.slice(2, 5) +
    "." +
    this.slice(5, 8) +
    "/" +
    this.slice(8, 12) +
    "-" +
    this.slice(12, 14)
  );
};

String.prototype.maskPhone = function () {
  let phone = this;
  if (this.length == 11) phone = this.slice(0, 2) + this.slice(3);
  return (
    "(" +
    phone.slice(0, 2) +
    ") 9" +
    phone.slice(2, 6) +
    "-" +
    phone.slice(6, 10)
  );
};

String.prototype.removeMask = function () {
  return this.replace(/\.|\/|-|\(|\)|\s*/g, "");
};
