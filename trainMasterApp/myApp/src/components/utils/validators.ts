export type FieldError = string | null;

export const required = (v: string, label = "Campo"): FieldError =>
  v?.trim() ? null : `${label} é obrigatório`;

export const email = (v: string): FieldError => {
  if (!v.trim()) return "E-mail é obrigatório";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(v) ? null : "E-mail inválido";
};

export const cpf = (v: string): FieldError => {
  const digits = (v || "").replace(/\D/g, "");
  if (digits.length !== 11) return "CPF inválido";
  if (/^(\d)\1{10}$/.test(digits)) return "CPF inválido";

  const calc = (base: string, factor: number) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i], 10) * (factor - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(digits.substring(0, 9), 10);
  const d2 = calc(digits.substring(0, 10), 11);

  return d1 === parseInt(digits[9], 10) && d2 === parseInt(digits[10], 10)
    ? null
    : "CPF inválido";
};

export const birthDateBR = (v: string): FieldError => {
  if (!v.trim()) return "Data de nascimento é obrigatória";
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return "Use o formato dd/mm/aaaa";

  const dd = +m[1],
    mm = +m[2] - 1,
    yyyy = +m[3];
  const d = new Date(yyyy, mm, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm || d.getDate() !== dd)
    return "Data inválida";

  const today = new Date();
  if (d > today) return "Data no futuro não é permitida";

  const min = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate()
  );
  if (d > min) return "É preciso ter pelo menos 16 anos";

  return null;
};

export const oneOf =  (options: string[], label = "Campo") =>
    (v: string): FieldError => {
      if (!v.trim()) return `${label} é obrigatório`;
      return options.map((o) => o.toLowerCase()).includes(v.trim().toLowerCase())
        ? null
        : `${label} inválido`;
    };

export const minLength =
  (n: number, label = "Campo") =>
  (v: string): FieldError =>
    v.trim().length >= n ? null : `${label} deve ter ao menos ${n} caracteres`;

export const passwordsMatch =
  (passwordValue: string) =>
  (confirmValue: string): FieldError =>
    confirmValue === passwordValue ? null : "Confirmar senha não confere";

