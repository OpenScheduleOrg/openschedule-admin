export default {
  cpf: (event: Event): void => {
    const el = event.target as HTMLInputElement;
    let value = el.value;
    const key = (event as InputEvent).data;

    const without_mask = value.removeMask();
    if (
      (event as InputEvent).inputType === "insertFromPaste" &&
      without_mask.match(/\d{11}/)
    )
      el.value = without_mask.maskCpf();

    if (
      value.length == 15 ||
      (key &&
        key.match(/\D/) &&
        (value.length != 4 || (value.length == 4 && !key.match(/\./))) &&
        (value.length != 8 || (value.length == 8 && !key.match(/\./))) &&
        (value.length != 12 || (value.length == 12 && !key.match(/-/))))
    ) {
      el.value = el.value.slice(0, -1);
    } else if (value.length == 4) {
      const v = value[3];
      if (v != ".") {
        value = value.slice(0, -1) + ".";
        el.value = value + v;
      }
    } else if (value.length == 8) {
      const v = value[7];
      if (v != ".") {
        value = value.slice(0, -1) + ".";
        el.value = value + v;
      }
    } else if (value.length == 12) {
      const v = value[11];
      if (v != "-") {
        value = value.slice(0, -1) + "-";
        el.value = value + v;
      }
    }
  },
  cnpj: (event: Event): void => {
    const el = event.target as HTMLInputElement;
    let value = el.value;
    const key = (event as InputEvent).data;

    const without_mask = value.removeMask();
    if (
      (event as InputEvent).inputType === "insertFromPaste" &&
      without_mask.match(/\d{14}/)
    )
      el.value = without_mask.maskCnpj();

    if (
      value.length > 18 ||
      (key &&
        key.match(/\D/) &&
        (value.length != 3 || (value.length == 3 && !key.match(/\./))) &&
        (value.length != 7 || (value.length == 7 && !key.match(/\./))) &&
        (value.length != 11 || (value.length == 11 && !key.match(/\//))) &&
        (value.length != 16 || (value.length == 16 && !key.match(/\./))))
    ) {
      el.value = el.value.slice(0, -1);
    } else if (value.length == 3) {
      const v = value[2];
      if (v != ".") {
        value = value.slice(0, -1) + ".";
        el.value = value + v;
      }
    } else if (value.length == 7) {
      const v = value[6];
      if (v != ".") {
        value = value.slice(0, -1) + ".";
        el.value = value + v;
      }
    } else if (value.length == 11) {
      const v = value[10];
      if (v != "/") {
        value = value.slice(0, -1) + "/";
        el.value = value + v;
      }
    } else if (value.length == 16) {
      const v = value[15];
      if (v != "-") {
        value = value.slice(0, -1) + "-";
        el.value = value + v;
      }
    }
  },
  phone: (event: Event): void => {
    const el = event.target as HTMLInputElement;
    let value = el.value;
    const key = (event as InputEvent).data;

    const without_mask = value.removeMask();
    if (
      (event as InputEvent).inputType === "insertFromPaste" &&
      (without_mask.match(/\d{10}/) || without_mask.match(/\d{11}/))
    )
      el.value = without_mask.maskPhone();

    if (
      value.length === 16 ||
      (key &&
        key.match(/\D/) &&
        (value.length != 1 || (value.length == 1 && !key.match(/\(/))) &&
        (value.length != 4 || (value.length == 4 && !key.match(/\)/))) &&
        (value.length != 5 || (value.length == 5 && !key.match(/\s/))) &&
        (value.length != 11 || (value.length == 11 && !key.match(/-/))))
    ) {
      el.value = el.value.slice(0, -1);
    } else if (value.length == 1) {
      const v = value[0];
      if (v != "(") {
        value = value.slice(0, -1) + "(";
        el.value = value + v;
      }
    } else if (value.length == 4) {
      const v = value[3];
      if (v != ")") {
        value = value.slice(0, -1) + ") ";
        if (v != "9") value = value + "9";
        el.value = value + v;
      }
    } else if (value.length == 5 && key) {
      const v = value[4];
      if (v != " ") {
        value = value.slice(0, -1) + " ";
        if (v != "9") value = value + "9";
        el.value = value + v;
      }
    } else if (value.length == 6 && key) {
      const v = value[5];
      if (v != "9") {
        value = value.slice(0, -1) + "9";
        el.value = value + v;
      }
    } else if (value.length == 11) {
      const v = value[10];
      if (v != "-") {
        value = value.slice(0, -1) + "-";
        el.value = value + v;
      }
    }
  },
} as { [format: string]: (e: Event) => void };
