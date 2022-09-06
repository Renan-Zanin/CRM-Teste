export function telephoneFormatter(tel: number) {
  return tel.toString().replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
}

export function dateFormat(timestamp: any) {
  if (timestamp) {
    const date = new Date(timestamp.toDate());

    const day = date.toLocaleDateString("pt-BR");

    return `${day}`;
  }
}

export function hourFormat(timestamp: any) {
  if (timestamp) {
    const date = new Date(timestamp.toDate());

    const hour = date.toLocaleTimeString("pt-BR");

    return `${hour}`;
  }
}

export const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
