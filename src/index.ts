import 'dotenv/config'
import { RentParser } from 'services/parser'
import { rentParserConfig } from 'configs/rent-parser'

const rentParser = new RentParser(rentParserConfig)

void (async () => {
  await rentParser.updateAndNotify()
})()
