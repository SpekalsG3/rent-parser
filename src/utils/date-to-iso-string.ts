export function toIsoString (date: Date): string {
  const tzo = -date.getTimezoneOffset()
  const dif = tzo >= 0 ? '+' : '-'

  const pad = function (num): string {
    const norm = Math.floor(Math.abs(num))
    return `${norm < 10 ? '0' : ''}${norm}`
  }

  return `${
    date.getFullYear()
  }-${
    pad(date.getMonth() + 1)
  }-${
    pad(date.getDate())
  }T${
    pad(date.getHours())
  }:${
    pad(date.getMinutes())
  }:${
    pad(date.getSeconds())
  }${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`
}
