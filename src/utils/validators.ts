export default {
  required: (value) => {
    if (!value) return "Campo não pode ser vazio";
    return undefined;
  },
  phone: (value) => {
    if (!value?.match(/\(\d{2}\) 9\d{4}-\d{4}/)) return "Telefone não é válido";
    return undefined;
  },
  cpf: (value) => {
    const cpf = value?.trim()?.removeMask() as string;
    if (cpf.match(/\d{11}/)) {
      const digits = cpf.split("").map((x) => Number(x));
      const dvs = [0, 0];

      for (let i = 11; i > 2; i--) {
        dvs[0] = dvs[0] + digits[11 - i] * (i - 1);
        dvs[1] = dvs[1] + digits[11 - i] * i;
      }
      dvs[0] = ((11 - (dvs[0] % 11)) % 11) % 10;
      dvs[1] = ((11 - ((dvs[1] + dvs[0] * 2) % 11)) % 11) % 10;
      if (dvs[0] == digits[9] && dvs[1] == digits[10]) return undefined;
    }

    return "CPF inválido";
  },
  cnpj: (value) => {
    const cnpj = value?.trim()?.removeMask() as string;

    if (cnpj.match(/\d{14}/)) {
      const digits = cnpj.split("").map((x) => Number(x));
      const dvs = [0, 0];
      let i = 6;
      let j = 5;
      for (const d of digits.slice(0, 12)) {
        dvs[0] += i * d;
        dvs[1] += j * d;
        i += i < 9 ? 1 : -7;
        j += j < 9 ? 1 : -7;
      }
      dvs[0] = (dvs[0] % 11) % 10;
      dvs[1] = ((dvs[1] + dvs[0] * 9) % 11) % 10;
      if (dvs[0] == digits[12] && dvs[1] == digits[13]) return undefined;
    }
    return "CNPJ inválido";
  },
  email: (value) => {
    if (
      value
        ?.toLocaleLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      return undefined;
    return "E-mail inválido";
  },
  password: (value) => {
    if (value?.match(/.{6,}/)) return undefined;
    return "Senha deve possui mais de 6 caracteres";
  },
} as {
  [name: string]: (
    value: string | undefined,
    params?: any
  ) => string | undefined;
};
