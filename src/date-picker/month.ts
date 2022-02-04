import { html } from 'lit';
import { LocalizedText } from './localization.js';
import { DatePickerDay, DatePickerDayProps } from './day.js';
import { getViewOfMonth, inRange, DaysOfWeek, isEqual } from '../utils/date.js';
import { DateDisabledPredicate } from './DatePicker.js';

function chunk<T>(array: T[], chunkSize: number): T[][] {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

function mapWithOffset<T, U>(array: T[], startingOffset: number, mapFn: (item: T) => U): U[] {
  return array.map((_, i) => {
    const adjustedIndex = (i + startingOffset) % array.length;
    return mapFn(array[adjustedIndex]);
  });
}

type DatePickerMonthProps = {
  selectedDate?: Date;
  focusedDate: Date;
  labelledById: string;
  localization: LocalizedText;
  firstDayOfWeek: DaysOfWeek;
  min?: Date;
  max?: Date;
  dateFormatter: Intl.DateTimeFormat;
  isDateDisabled: DateDisabledPredicate;
  onDateSelect: DatePickerDayProps['onDaySelect'];
  onKeyboardNavigation: DatePickerDayProps['onKeyboardNavigation'];
  focusedDayRef: (element: HTMLButtonElement) => void;
};

export function DatePickerMonth({
  selectedDate,
  focusedDate,
  labelledById,
  localization,
  firstDayOfWeek,
  min,
  max,
  dateFormatter,
  isDateDisabled,
  onDateSelect,
  onKeyboardNavigation,
  focusedDayRef,
}: DatePickerMonthProps) {
  const today = new Date();
  const days = getViewOfMonth(focusedDate, firstDayOfWeek);

  return html`
    <table class="date-picker__table" aria-labelledby=${labelledById}>
      <thead>
        <tr>
          ${mapWithOffset(
            localization.dayNames,
            firstDayOfWeek,
            dayName =>
              html`<th class="date-picker__table-header" scope="col">
                <span aria-hidden="true">${dayName.substring(0, 2)}</span>
                <span class="date-picker__vhidden">${dayName}</span>
              </th>`
          )}
        </tr>
      </thead>
      <tbody>
        ${chunk(days, 7).map(
          week => html`
            <tr class="date-picker__row">
              ${week.map(
                day =>
                  html`
                    <td class="date-picker__cell">
                      ${DatePickerDay({
                        day,
                        today,
                        focusedDay: focusedDate,
                        isSelected: isEqual(day, selectedDate),
                        disabled: isDateDisabled(day),
                        inRange: inRange(day, min, max),
                        onDaySelect: onDateSelect,
                        dateFormatter,
                        onKeyboardNavigation,
                        focusedDayRef,
                      })}
                    </td>
                  `
              )}
            </tr>
          `
        )}
      </tbody>
    </table>
  `;
}
