import { en as calendarEn } from '../calendar/localization.js';

export const en = {
  ...calendarEn,
  buttonLabel: 'Choose date',
  selectedDateMessage: 'Selected date is',
  closeLabel: 'Close window',
};

export type DatePickerLocalizedText = typeof en;
