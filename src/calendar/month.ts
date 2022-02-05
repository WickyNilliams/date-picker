import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getViewOfMonth, inRange as dateInRange, DaysOfWeek, isEqual, isEqualMonth } from '../utils/date.js';
import { CalendarLocalizedText } from './localization.js';
import { Calendar } from './Calendar.js';

export type DatePickerDayProps = {
  focusedDay: Date;
  today: Date;
  day: Date;
  disabled: boolean;
  inRange: boolean;
  isSelected: boolean;
  dateFormatter: Intl.DateTimeFormat;
  onDaySelect: (day: Date) => void;
};

export function DatePickerDay({
  focusedDay,
  today,
  day,
  onDaySelect,
  disabled,
  inRange,
  isSelected,
  dateFormatter,
}: DatePickerDayProps) {
  const isToday = isEqual(day, today);
  const isMonth = isEqualMonth(day, focusedDay);
  const isFocused = isEqual(day, focusedDay);
  const isOutsideRange = !inRange;

  return html`
    <button
      type="button"
      class=${classMap({
        'date-picker__day': true,
        'is-outside': isOutsideRange,
        'is-today': isToday,
        'is-month': isMonth,
        'is-disabled': disabled,
      })}
      tabindex=${isFocused ? 0 : -1}
      @click=${() => onDaySelect(day)}
      aria-disabled=${ifDefined(disabled ? 'true' : undefined)}
      ?disabled=${isOutsideRange}
      aria-label=${dateFormatter.format(day)}
      aria-pressed=${isSelected ? 'true' : 'false'}
      aria-current=${ifDefined(isToday ? 'date' : undefined)}
    >
      <span aria-hidden="true">${day.getDate()}</span>
    </button>
  `;
}

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
  localization: CalendarLocalizedText;
  firstDayOfWeek: DaysOfWeek;
  min?: Date;
  max?: Date;
  dateFormatter: Intl.DateTimeFormat;
  isDateDisabled: Calendar['isDateDisabled'];
  onDateSelect: DatePickerDayProps['onDaySelect'];
  onKeyboardNavigation: (event: KeyboardEvent) => void;
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
}: DatePickerMonthProps) {
  const today = new Date();
  const days = getViewOfMonth(focusedDate, firstDayOfWeek);

  return html`
    <table aria-labelledby=${labelledById}>
      <thead>
        <tr>
          ${mapWithOffset(
            localization.dayNames,
            firstDayOfWeek,
            dayName =>
              html`
                <th scope="col">
                  <span aria-hidden="true">${dayName.substring(0, 2)}</span>
                  <span class="date-picker__vhidden">${dayName}</span>
                </th>
              `
          )}
        </tr>
      </thead>
      <tbody @keydown=${onKeyboardNavigation}>
        ${chunk(days, 7).map(
          week => html`
            <tr>
              ${week.map(
                day =>
                  html`
                    <td>
                      ${DatePickerDay({
                        day,
                        today,
                        focusedDay: focusedDate,
                        isSelected: isEqual(day, selectedDate),
                        disabled: isDateDisabled(day),
                        inRange: dateInRange(day, min, max),
                        onDaySelect: onDateSelect,
                        dateFormatter,
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
