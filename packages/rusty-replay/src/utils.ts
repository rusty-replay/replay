import { zlibSync, unzlibSync } from 'fflate';

export function compressToBase64(obj: any): string {
  const json = JSON.stringify(obj);
  const compressed = zlibSync(new TextEncoder().encode(json));
  return btoa(String.fromCharCode(...compressed));
}

export function decompressFromBase64(base64: string): any[] {
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const json = new TextDecoder().decode(unzlibSync(binary));
  return JSON.parse(json);
}
