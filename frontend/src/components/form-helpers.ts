export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinList(value: string[] | null | undefined): string {
  return value?.join(", ") ?? "";
}
