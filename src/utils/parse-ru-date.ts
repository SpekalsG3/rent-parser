const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const periods = [
  // ['секунду', 'секунд', 'минуту', 'минуты', 'час', 'часа', 'часов', 'день', 'дня', 'дней', 'неделю', 'недели', 'неделей'],
  ['год', 'года', 'лет'],
]

export function parseRuDate (absolute: string, relative: string): Date {
  const [day, ruMonth, time] = absolute.split(' ')
  const [hour, minute] = time.split(':')

  let year = new Date().getFullYear()
  if (relative) {
    const [value, alias] = relative.split(' ')
    if (periods[0].includes(alias)) {
      year -= Number(value)
    }
  }

  return new Date(year, months.indexOf(ruMonth), Number(day), Number(hour), Number(minute))
}
