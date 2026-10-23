export function copyCodeToClipboard(code: string): Promise<void> {
  return navigator.clipboard.writeText(code);
}