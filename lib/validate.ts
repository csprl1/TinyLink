const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function isValidCode(code: string): boolean {
  return CODE_REGEX.test(code);
}

export function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6 + Math.floor(Math.random() * 3); // 6–8
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
