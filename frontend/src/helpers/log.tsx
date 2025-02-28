const log = (...args: string[]) => {
  const date = new Date()
  // eslint-disable-next-line no-console
  console.log(`%c[${date.toLocaleTimeString('uk-UA')}.${date.getMilliseconds()}]: `, 'color: green', ...args)
}

export default log
