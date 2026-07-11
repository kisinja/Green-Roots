export function normalizePhone(phone: string) {
  let value = phone.replace(/\s+/g, "");

  if (value.startsWith("+")) {
    value = value.substring(1);
  }

  if (value.startsWith("0")) {
    value = "254" + value.substring(1);
  }

  return value;
}