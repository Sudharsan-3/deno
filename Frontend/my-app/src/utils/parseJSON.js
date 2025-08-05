export function safeParse(json, fallback = null) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }
  