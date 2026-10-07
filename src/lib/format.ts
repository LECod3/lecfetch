// 1024 ** 3 = 1073741824: one gibibyte. Node reports bytes, humans read GiB.
export function formatBytes(bytes: number): string {
  const gibibytes = bytes / 1024 ** 3;
  return `${gibibytes.toFixed(1)} GiB`;
}

// 2237 seconds -> "37m", 7000 seconds -> "1h 56m".
export function formatUptime(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
