import { mathRandom } from '../utils/math-random'

export interface IOptions {
  idLength?: number
}

const defaultOptions: Required<IOptions> = {
  idLength: 5,
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '123456789'

export class Logger {
  private readonly name: string
  private id: string
  private readonly options: IOptions

  constructor (name: string, options: IOptions = {}) {
    this.name = name
    this.options = Object.keys(defaultOptions).reduce((acc, key) => Object.assign(acc, { [key]: options[key] || defaultOptions[key] }), {})

    this.id = this.generateId()
  }

  private generateId (): string {
    let id = ''
    for (let i = 0; i < this.options.idLength; i++) {
      let coinFlip = Math.round(Math.random())
      if (coinFlip === 0) {
        coinFlip = Math.round(Math.random())
        const index = mathRandom(0, alphabet.length)
        id += coinFlip === 0 ? alphabet[index] : alphabet[index].toUpperCase()
      } else {
        const index = mathRandom(0, numbers.length)
        id += numbers[index]
      }
    }
    return id
  }

  public info (...args: string[]): void {
    console.log(`[INFO ${this.name}: ${this.id}] ${args.join('')}`)
  }

  public debug (...args: string[]): void {
    console.log(`[DEBUG ${this.name}: ${this.id}] ${args.join('')}`)
  }

  public error (...args: string[]): void {
    console.error(`[ERROR ${this.name}: ${this.id}] ${args.join('')}`)
  }

  public resetId (): void {
    this.id = this.generateId()
  }
}
