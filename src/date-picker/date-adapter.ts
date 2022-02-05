import { parseISODate, printISODate, createDate } from '../utils/date.js';

type CreateDate = typeof createDate;
export type DateParser = (input: string, createDate: CreateDate) => Date | undefined;
export type DateFormatter = (date: Date) => string;

export interface DateAdapter {
  parse: DateParser | RegExp;
  format: DateFormatter | string;
  disallowedCharacters: RegExp | false;
}

const isoAdapter: DateAdapter = {
  parse: parseISODate,
  format: printISODate,
  disallowedCharacters: /[^0-9-]/g,
};
export default isoAdapter;
