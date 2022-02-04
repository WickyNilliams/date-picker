import { html, LitElement, PropertyValues } from 'lit';
import { state, property, query } from 'lit/decorators.js';
import {
  addDays,
  clamp,
  DaysOfWeek,
  endOfMonth,
  endOfWeek,
  inRange,
  parseISODate,
  printISODate,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
} from '../utils/date.js';
import { en } from './localization.js';
import { DatePickerMonth } from './month.js';
import { style } from './style.css.js';

function range(from: number, to: number) {
  const result: number[] = [];

  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
}

const keyCode = {
  TAB: 9,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export class Calendar extends LitElement {
  static styles = style;
  // static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  private monthSelectId = 'month-select';
  private yearSelectId = 'year-select';
  private dialogLabelId = 'dialog-label';

  @query('.date-picker__select--month', true) private monthSelectNode!: HTMLElement;
  @query(`button[tabindex="0"]`) private focusedDayNode!: HTMLButtonElement;

  private dateFormatShort!: Intl.DateTimeFormat;

  private initialTouchX = 0;
  private initialTouchY = 0;

  @state() focusedDay = new Date();
  @state() activeFocus = false;

  /**
   * Date value. Must be in IS0-8601 format: YYYY-MM-DD.
   */
  @property({ reflect: true }) value: string = '';

  /**
   * Minimum date allowed to be picked. Must be in IS0-8601 format: YYYY-MM-DD.
   * This setting can be used alone or together with the max property.
   */
  @property() min: string = '';

  /**
   * Maximum date allowed to be picked. Must be in IS0-8601 format: YYYY-MM-DD.
   * This setting can be used alone or together with the min property.
   */
  @property() max: string = '';

  /**
   * Which day is considered first day of the week? `0` for Sunday, `1` for Monday, etc.
   * Default is Monday.
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;

  /**
   * Button labels, day names, month names, etc, used for localization.
   * Default is English.
   */
  @property({ attribute: false }) localization: typeof en = en;

  /**
   * Controls which days are disabled and therefore disallowed.
   * For example, this can be used to disallow selection of weekends.
   */
  @property() isDateDisabled: (date: Date) => boolean = () => false;

  protected willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('value')) {
      this.setFocusedDay(parseISODate(this.value) || new Date());
    }
    if (_changedProperties.has('localization')) {
      this.dateFormatShort = new Intl.DateTimeFormat(this.localization.locale, { day: 'numeric', month: 'long' });
    }
  }

  // focus(options?: FocusOptions & { target: 'day' | 'month' }) {
  focus(options?: Parameters<HTMLElement['focus']>[0] & { target: 'day' | 'month' }) {
    const target = options?.target ?? 'day';

    if (target === 'day') {
      this.focusedDayNode.focus();
    } else if (target === 'month') {
      this.monthSelectNode.focus();
    }
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('focusedDay') && this.activeFocus) {
      this.focusedDayNode.focus();
    }
  }

  render() {
    const valueAsDate = parseISODate(this.value);
    const selectedYear = (valueAsDate || this.focusedDay).getFullYear();
    const focusedMonth = this.focusedDay.getMonth();
    const focusedYear = this.focusedDay.getFullYear();

    const minDate = parseISODate(this.min);
    const maxDate = parseISODate(this.max);
    const prevMonthDisabled =
      minDate != null && minDate.getMonth() === focusedMonth && minDate.getFullYear() === focusedYear;
    const nextMonthDisabled =
      maxDate != null && maxDate.getMonth() === focusedMonth && maxDate.getFullYear() === focusedYear;

    const minYear = minDate ? minDate.getFullYear() : selectedYear - 10;
    const maxYear = maxDate ? maxDate.getFullYear() : selectedYear + 10;

    return html`
      <div @touchmove=${this.handleTouchMove} @touchstart=${this.handleTouchStart} @touchend=${this.handleTouchEnd}>
        <div class="date-picker__header" @focusin=${this.disableActiveFocus}>
          <div>
            <h2 id=${this.dialogLabelId} class="date-picker__vhidden" aria-live="polite" aria-atomic="true">
              ${this.localization.monthNames[focusedMonth]} ${this.focusedDay.getFullYear()}
            </h2>

            <label htmlFor=${this.monthSelectId} class="date-picker__vhidden">
              ${this.localization.monthSelectLabel}
            </label>
            <div class="date-picker__select">
              <select id=${this.monthSelectId} class="date-picker__select--month" @change=${this.handleMonthSelect}>
                ${this.localization.monthNames.map(
                  (month, i) =>
                    html`<option
                      key=${month}
                      value=${i}
                      ?selected=${i === focusedMonth}
                      ?disabled=${!inRange(
                        new Date(focusedYear, i, 1),
                        minDate ? startOfMonth(minDate) : undefined,
                        maxDate ? endOfMonth(maxDate) : undefined
                      )}
                    >
                      ${month}
                    </option>`
                )}
              </select>
              <div class="date-picker__select-label" aria-hidden="true">
                <span>${this.localization.monthNamesShort[focusedMonth]}</span>
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M8.12 9.29L12 13.17l3.88-3.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0L6.7 10.7c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z"
                  />
                </svg>
              </div>
            </div>

            <label htmlFor=${this.yearSelectId} class="date-picker__vhidden">
              ${this.localization.yearSelectLabel}
            </label>
            <div class="date-picker__select">
              <select id=${this.yearSelectId} class="date-picker__select--year" @change=${this.handleYearSelect}>
                ${range(minYear, maxYear).map(
                  year => html`<option key=${year} ?selected=${year === focusedYear}>${year}</option>`
                )}
              </select>
              <div class="date-picker__select-label" aria-hidden="true">
                <span>${this.focusedDay.getFullYear()}</span>
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M8.12 9.29L12 13.17l3.88-3.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0L6.7 10.7c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="date-picker__nav">
            <button
              class="date-picker__prev"
              @click=${this.handlePreviousMonthClick}
              ?disabled=${prevMonthDisabled}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"
                />
              </svg>
              <span class="date-picker__vhidden">${this.localization.prevMonthLabel}</span>
            </button>
            <button
              class="date-picker__next"
              @click=${this.handleNextMonthClick}
              ?disabled=${nextMonthDisabled}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"
                />
              </svg>
              <span class="date-picker__vhidden">${this.localization.nextMonthLabel}</span>
            </button>
          </div>
        </div>

        ${DatePickerMonth({
          dateFormatter: this.dateFormatShort,
          selectedDate: valueAsDate,
          focusedDate: this.focusedDay,
          onDateSelect: this.handleDaySelect,
          onKeyboardNavigation: this.handleKeyboardNavigation,
          labelledById: this.dialogLabelId,
          localization: this.localization,
          firstDayOfWeek: this.firstDayOfWeek,
          focusedDayRef: this.processFocusedDayNode,
          min: minDate,
          max: maxDate,
          isDateDisabled: this.isDateDisabled,
        })}
      </div>
    `;
  }

  /**
   * Local methods.
   */
  private enableActiveFocus = () => {
    this.activeFocus = true;
  };

  private disableActiveFocus = () => {
    this.activeFocus = false;
  };

  private addDays(days: number) {
    this.setFocusedDay(addDays(this.focusedDay, days));
  }

  private addMonths(months: number) {
    this.setMonth(this.focusedDay.getMonth() + months);
  }

  private addYears(years: number) {
    this.setYear(this.focusedDay.getFullYear() + years);
  }

  private startOfWeek() {
    this.setFocusedDay(startOfWeek(this.focusedDay, this.firstDayOfWeek));
  }

  private endOfWeek() {
    this.setFocusedDay(endOfWeek(this.focusedDay, this.firstDayOfWeek));
  }

  private setMonth(month: number) {
    const min = setMonth(startOfMonth(this.focusedDay), month);
    const max = endOfMonth(min);
    const date = setMonth(this.focusedDay, month);

    this.setFocusedDay(clamp(date, min, max));
  }

  private setYear(year: number) {
    const min = setYear(startOfMonth(this.focusedDay), year);
    const max = endOfMonth(min);
    const date = setYear(this.focusedDay, year);

    this.setFocusedDay(clamp(date, min, max));
  }

  private setFocusedDay(day: Date) {
    this.focusedDay = clamp(day, parseISODate(this.min), parseISODate(this.max));
  }

  private handleTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    this.initialTouchX = touch.pageX;
    this.initialTouchY = touch.pageY;
  };

  private handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
  };

  private handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const distX = touch.pageX - this.initialTouchX; // get horizontal dist traveled
    const distY = touch.pageY - this.initialTouchY; // get vertical dist traveled
    const threshold = 70;

    const isHorizontalSwipe = Math.abs(distX) >= threshold && Math.abs(distY) <= threshold;

    if (isHorizontalSwipe) {
      this.addMonths(distX < 0 ? 1 : -1);
    }
  };

  private handleNextMonthClick = (event: MouseEvent) => {
    event.preventDefault();
    this.addMonths(1);
  };

  private handlePreviousMonthClick = (event: MouseEvent) => {
    event.preventDefault();
    this.addMonths(-1);
  };

  private handleKeyboardNavigation = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case keyCode.RIGHT:
        this.addDays(1);
        break;
      case keyCode.LEFT:
        this.addDays(-1);
        break;
      case keyCode.DOWN:
        this.addDays(7);
        break;
      case keyCode.UP:
        this.addDays(-7);
        break;
      case keyCode.PAGE_UP:
        if (event.shiftKey) {
          this.addYears(-1);
        } else {
          this.addMonths(-1);
        }
        break;
      case keyCode.PAGE_DOWN:
        if (event.shiftKey) {
          this.addYears(1);
        } else {
          this.addMonths(1);
        }
        break;
      case keyCode.HOME:
        this.startOfWeek();
        break;
      case keyCode.END:
        this.endOfWeek();
        break;
      default:
        return;
    }

    event.preventDefault();
    this.enableActiveFocus();
  };

  private handleDaySelect = (_event: MouseEvent, day: Date) => {
    const isInRange = inRange(day, parseISODate(this.min), parseISODate(this.max));
    const isAllowed = !this.isDateDisabled(day);

    if (isInRange && isAllowed) {
      this.setValue(day);
    } else {
      // for consistency we should set the focused day in cases where
      // user has selected a day that has been specifically disallowed
      this.setFocusedDay(day);
    }
  };

  private handleMonthSelect = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.setMonth(parseInt(select.value, 10));
  };

  private handleYearSelect = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.setYear(parseInt(select.value, 10));
  };

  private setValue(date?: Date) {
    this.value = date ? printISODate(date) : '';

    this.dispatchEvent(
      new CustomEvent('calendar-change', {
        detail: {
          value: this.value,
          valueAsDate: date,
        },
      })
    );
  }

  private processFocusedDayNode = () => {
    if (this.activeFocus) {
      setTimeout(() => this.focusedDayNode.focus(), 0);
    }
  };
}
