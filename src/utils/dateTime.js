export function getJakartaTime() {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const wibTime = new Date(utc + (7 * 3600000))
  
  const year = wibTime.getFullYear()
  const month = String(wibTime.getMonth() + 1).padStart(2, '0')
  const day = String(wibTime.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  const hour = String(wibTime.getHours()).padStart(2, '0')
  
  return { date: dateStr, hour }
}

export function getFullJakartaDateTime() {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  const utcTime = new Date(now.getTime() + offsetMs)
  const wibTime = new Date(utcTime.getTime() + (7 * 60 * 60 * 1000))
  
  const year = wibTime.getFullYear()
  const month = String(wibTime.getMonth() + 1).padStart(2, '0')
  const day = String(wibTime.getDate()).padStart(2, '0')
  const hours = String(wibTime.getHours()).padStart(2, '0')
  const minutes = String(wibTime.getMinutes()).padStart(2, '0')
  const seconds = String(wibTime.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}