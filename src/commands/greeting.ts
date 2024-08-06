import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import { bold, green } from 'picocolors'

interface GreetingArgv {
  age?: number
}

export const command = 'greeting'
export const describe = 'Displays interactive prompts to demonstrate user input handling.'
export const aliases = ['g']

export function builder(yargs: Argv<GreetingArgv>): Argv<GreetingArgv> {
  return yargs.option('age', {
    type: 'number',
    description: 'Your age',
    alias: 'a',
  })
}

export async function handler(argv: ArgumentsCamelCase<GreetingArgv>) {
  const age: GreetingArgv['age'] = argv?.age ?? undefined

  const username = await logger.prompt('What is your name?', {
    type: 'text',
  })

  logger.log(`Hello, ${green(bold(username))}!`)

  const mood = await logger.prompt('How are you?', {
    type: 'select',
    options: [
      '👌',
      '👍',
      '👎',
      {
        label: '🤬',
        value: '🤬',
        hint: 'take care',
      },
    ],
  })

  logger.log(`${green(bold(username))} ${mood}, Ciao! ${age ? `Your age is: ${age}.` : ''}`)
}
