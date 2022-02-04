import { html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { printISODate, parseISODate, DaysOfWeek, createDate } from '../utils/date.js';
import { DatePickerInput } from './input.js';
import { en, DatePickerLocalizedText } from './localization.js';
import isoAdapter, { DateAdapter } from './date-adapter.js';
import { style } from './style.css.js';
import '../calendar/date-calendar.js';
import { Calendar } from '../calendar/Calendar.js';

function cleanValue(input: HTMLInputElement, regex: RegExp): string {
  const { value } = input;
  const cursor = input.selectionStart as number;

  const beforeCursor = value.slice(0, cursor);
  const afterCursor = value.slice(cursor, value.length);

  const filteredBeforeCursor = beforeCursor.replace(regex, '');
  const filterAfterCursor = afterCursor.replace(regex, '');

  const newValue = filteredBeforeCursor + filterAfterCursor;
  const newCursor = filteredBeforeCursor.length;

  input.value = newValue;
  input.selectionStart = newCursor;
  input.selectionEnd = newCursor;

  return newValue;
}

const DISALLOWED_CHARACTERS = /[^0-9./-]+/g;
const TRANSITION_MS = 300;

export class DatePicker extends LitElement {
  static styles = style;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @query(`.date-picker__toggle`, true) private datePickerButton!: HTMLButtonElement;
  @query(`.date-picker__input`, true) private datePickerInput!: HTMLInputElement;
  @query(`.date-picker__close`, true) private closeButton!: HTMLButtonElement;
  @query(`date-calendar`, true) private calendar!: Calendar;
  @query(`[role="dialog"]`, true) private dialogWrapperNode!: HTMLElement;

  private inputId = 'input';
  private dialogLabelId = 'dialog-label';

  // private firstFocusableElement?: HTMLElement;
  // private dialogWrapperNode?: HTMLElement;

  private focusTimeoutId?: ReturnType<typeof setTimeout>;

  private initialTouchX = 0;
  private initialTouchY = 0;

  /**
   * Whilst dateAdapter is used for handling the formatting/parsing dates in the input,
   * these are used to format dates exclusively for the benefit of screen readers.
   *
   * We prefer DateTimeFormat over date.toLocaleDateString, as the former has
   * better performance when formatting large number of dates. See:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Performance
   */
  private dateFormatLong!: Intl.DateTimeFormat;

  @state() activeFocus = false;

  @state() focusedDay = new Date();

  @state() open = false;

  /**
   * Name of the date picker input.
   */
  @property() name: string = 'date';

  /**
   * Makes the date picker input component disabled. This prevents users from being able to
   * interact with the input, and conveys its inactive state to assistive technologies.
   */
  @property({ reflect: true, type: Boolean }) disabled: boolean = false;

  /**
   * Forces the opening direction of the calendar modal to be always left or right.
   * This setting can be useful when the input is smaller than the opening date picker
   * would be as by default the picker always opens towards right.
   */
  @property() direction: 'left' | 'right' = 'right';

  /**
   * Should the input be marked as required?
   */
  @property({ type: Boolean }) required: boolean = false;

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
  @property({ type: Number }) firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;

  /**
   * Button labels, day names, month names, etc, used for localization.
   * Default is English.
   */
  @property({ attribute: false }) localization: DatePickerLocalizedText = en;

  /**
   * Date adapter, for custom parsing/formatting.
   * Must be object with a `parse` function which accepts a `string` and returns a `Date`,
   * and a `format` function which accepts a `Date` and returns a `string`.
   * Default is IS0-8601 parsing and formatting.
   */
  @property({ attribute: false }) dateAdapter: DateAdapter = isoAdapter;

  /**
   * Controls which days are disabled and therefore disallowed.
   * For example, this can be used to disallow selection of weekends.
   */
  @property() isDateDisabled: Calendar['isDateDisabled'] = () => false;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  protected willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('localization')) {
      this.dateFormatLong = new Intl.DateTimeFormat(this.localization.locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  /**
   * Component event handling.
   */

  handleDocumentClick = (e: MouseEvent) => {
    if (!this.open) {
      return;
    }

    // the dialog and the button aren't considered clicks outside.
    // dialog for obvious reasons, but the button needs to be skipped
    // so that two things are possible:
    //
    // a) clicking again on the button when dialog is open should close the modal.
    //    without skipping the button here, we would see a click outside
    //    _and_ a click on the button, so the `open` state goes
    //    open -> close (click outside) -> open (click button)
    //
    // b) clicking another date picker's button should close the current calendar
    //    and open the new one. this means we can't stopPropagation() on the button itself
    //
    // this was the only satisfactory combination of things to get the above to work

    const isClickOutside = e.composedPath().every(node => node !== this.calendar && node !== this.datePickerButton);

    if (isClickOutside) {
      this.hide(false);
    }
  };

  /**
   * Public methods API
   */

  /**
   * Show the calendar modal, moving focus to the calendar inside.
   */
  show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('date-picker-open'));

    // this.setFocusedDay(parseISODate(this.value) || new Date());

    if (this.focusTimeoutId) {
      clearTimeout(this.focusTimeoutId);
    }

    this.focusTimeoutId = setTimeout(() => this.calendar?.focus(), TRANSITION_MS);
  }

  /**
   * Hide the calendar modal. Set `moveFocusToButton` to false to prevent focus
   * returning to the date picker's button. Default is true.
   */
  hide(moveFocusToButton = true) {
    this.open = false;
    this.dispatchEvent(new CustomEvent('date-picker-close'));

    // in cases where calendar is quickly shown and hidden
    // we should avoid moving focus to the button
    if (this.focusTimeoutId) {
      clearTimeout(this.focusTimeoutId);
    }

    if (moveFocusToButton) {
      // iOS VoiceOver needs to wait for all transitions to finish.
      setTimeout(() => this.datePickerButton?.focus(), TRANSITION_MS + 200);
    }
  }

  /**
   * Local methods.
   */
  // private enableActiveFocus = () => {
  //   this.activeFocus = true;
  // };

  // private disableActiveFocus = () => {
  //   this.activeFocus = false;
  // };

  private toggleOpen = (e: Event) => {
    e.preventDefault();

    if (this.open) {
      this.hide(false);
    } else {
      this.show();
    }
  };

  private handleEscKey = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.hide();
    }
  };

  private handleBlur = (event: Event) => {
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent('date-picker-blur'));
  };

  private handleFocus = (event: Event) => {
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent('date-picker-focus'));
  };

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

    const isDownwardsSwipe = Math.abs(distY) >= threshold && Math.abs(distX) <= threshold && distY > 0;

    if (isDownwardsSwipe) {
      this.hide(false);
      event.preventDefault();
    }
  };

  private focusFirst = () => {
    this.closeButton.focus();
  };

  private focusLast = () => {
    this.calendar.focus();
  };

  private handleInputChange = () => {
    const target = this.datePickerInput as HTMLInputElement;

    // clean up any invalid characters
    cleanValue(target, DISALLOWED_CHARACTERS);

    const parsed = this.dateAdapter.parse(target.value, createDate);
    if (parsed || target.value === '') {
      this.setValue(parsed);
    }
  };

  private handleDaySelect = (event: CustomEvent<{ valueAsDate: Date }>) => {
    this.setValue(event.detail.valueAsDate);
    this.hide();
  };

  private setValue(date?: Date) {
    this.value = date ? printISODate(date) : '';

    this.dispatchEvent(
      new CustomEvent('date-picker-change', {
        detail: {
          value: this.value,
          valueAsDate: date,
        },
      })
    );
  }

  render() {
    const valueAsDate = parseISODate(this.value);
    const formattedDate = valueAsDate ? this.dateAdapter.format(valueAsDate) : '';

    return html`
      <div class="date-picker">
        ${DatePickerInput({
          dateFormatter: this.dateFormatLong!,
          value: this.value,
          valueAsDate,
          formattedValue: formattedDate,
          onInput: this.handleInputChange,
          onBlur: this.handleBlur,
          onFocus: this.handleFocus,
          onClick: this.toggleOpen,
          name: this.name,
          disabled: this.disabled,
          required: this.required,
          identifier: this.inputId,
          localization: this.localization,
        })}

        <div
          class=${classMap({
            'date-picker__dialog': true,
            'is-left': this.direction === 'left',
            'is-active': this.open,
          })}
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby=${this.dialogLabelId}
          @touchmove=${this.handleTouchMove}
          @touchstart=${this.handleTouchStart}
          @touchend=${this.handleTouchEnd}
        >
          <div class="date-picker__dialog-content" @keydown=${this.handleEscKey}>
            <div tabindex="0" @focus=${this.focusLast}></div>

            <div class="date-picker__mobile">
              <label class="date-picker__mobile-heading">${this.localization.calendarHeading}</label>
              <button class="date-picker__close" @click=${() => this.hide()} type="button">
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  />
                </svg>
                <span class="date-picker__vhidden">${this.localization.closeLabel}</span>
              </button>
            </div>

            <date-calendar
              value=${this.value}
              @calendar-change=${this.handleDaySelect}
              min=${this.min}
              max=${this.max}
              first-day-of-week=${this.firstDayOfWeek}
              .localization=${this.localization}
              .isDateDisabled=${this.isDateDisabled}
            ></date-calendar>

            <div tabindex="0" @focus=${this.focusFirst}></div>
          </div>
        </div>
      </div>
    `;
  }
}
