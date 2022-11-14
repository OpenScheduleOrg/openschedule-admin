export {};

declare global {
  interface Number {
    toClockTime(): string;
  }
}

Number.prototype.toClockTime = function () {
  const hour = (this.valueOf() / 60) >> 0;
  const minutes = this.valueOf() % 60;

  return String(hour).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
};
