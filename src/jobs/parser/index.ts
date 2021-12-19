import { RentParser } from 'services/parser'
import { rentParserConfig } from 'configs/rent-parser'

const rentParser = new RentParser(rentParserConfig)

export const updateAndNotify = async (): Promise<any> => rentParser.updateAndNotify()
