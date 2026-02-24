export function isRetryableStatus(status: number): boolean {
  return status === 0 || status === 408 || status === 429 || (status >= 500 && status <= 599);
}

export function backoffDelay(attempt: number): number {
  // 0->500ms, 1->1000ms, 2->2000ms... cap 8000ms
  return Math.min(8000, 500 * Math.pow(2, attempt));
}