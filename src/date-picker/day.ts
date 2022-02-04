import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { isEqual, isEqualMonth } from '../utils/date.js';

export type DatePickerDayProps = {
  focusedDay: Date;
  today: Date;
  day: Date;
  disabled: boolean;
  inRange: boolean;
  isSelected: boolean;
  dateFormatter: Intl.DateTimeFormat;
  onDaySelect: (event: MouseEvent, day: Date) => void;
  onKeyboardNavigation: (event: KeyboardEvent) => void;
  focusedDayRef?: (element: HTMLButtonElement) => void;
};

export function DatePickerDay({
  focusedDay,
  today,
  day,
  onDaySelect,
  onKeyboardNavigation,
  focusedDayRef,
  disabled,
  inRange,
  isSelected,
  dateFormatter,
}: DatePickerDayProps) {
  const isToday = isEqual(day, today);
  const isMonth = isEqualMonth(day, focusedDay);
  const isFocused = isEqual(day, focusedDay);
  const isOutsideRange = !inRange;

  function handleClick(e: MouseEvent) {
    onDaySelect(e, day);
  }

  return html`
    <button
      class=${classMap({
        'date-picker__day': true,
        'is-outside': isOutsideRange,
        'is-today': isToday,
        'is-month': isMonth,
        'is-disabled': disabled,
      })}
      tabindex=${isFocused ? 0 : -1}
      @click=${handleClick}
      @keydown=${onKeyboardNavigation}
      aria-disabled=${ifDefined(disabled ? 'true' : undefined)}
      ?disabled=${isOutsideRange}
      type="button"
      aria-pressed=${isSelected ? 'true' : 'false'}
      aria-current=${ifDefined(isToday ? 'date' : undefined)}
      ${ref(el => {
        if (isFocused && el && focusedDayRef) {
          focusedDayRef(el as HTMLButtonElement);
        }
      })}
    >
      <span aria-hidden="true">${day.getDate()}</span>
      <span class="date-picker__vhidden">${dateFormatter.format(day)}</span>
    </button>
  `;
}
