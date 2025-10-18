export function format(date: Date | string, formatStr: string): string {
  const d = typeof date === "string" ? new Date(date) : date

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const dayOfWeek = d.getDay()

  // Simple format implementation
  return formatStr
    .replace("yyyy", year.toString())
    .replace("MMM", months[month])
    .replace("MM", (month + 1).toString().padStart(2, "0"))
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("EEE", days[dayOfWeek])
}

// test