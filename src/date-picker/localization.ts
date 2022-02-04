import { en as calendarEn } from '../calendar/localization.js';

export const en = {
  ...calendarEn,
  buttonLabel: 'Choose date',
  placeholder: 'YYYY-MM-DD',
  selectedDateMessage: 'Selected date is',
  closeLabel: 'Close window',
};

export type DatePickerLocalizedText = typeof en;
