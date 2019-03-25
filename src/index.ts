import * as program from 'commander'
import { version } from '../package.json'

program
  .version(version)

program
  .command('ping')
  .action(() => {
    console.log('pong!')
  })


program.parse(process.argv);

