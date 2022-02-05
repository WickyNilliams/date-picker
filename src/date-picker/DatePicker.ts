import { html, LitElement, nothing, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { printISODate, parseISODate, DaysOfWeek, createDate, parseFromRegex, formatFromString } from '../utils/date.js';
import { en, DatePickerLocalizedText } from './localization.js';
import isoAdapter, { DateAdapter } from './date-adapter.js';
import { style } from './style.css.js';
import '../calendar/date-calendar.js';
import { Calendar } from '../calendar/Calendar.js';
import { calendar as calendarIcon, close as closeIcon } from './icons.js';
import { FormDataController } from '../utils/FormDataController.js';
import { SwipeController } from '../utils/SwipeController.js';
import { cleanValue } from '../utils/input.js';

export class DatePicker extends LitElement {
  static styles = style;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @query(`.toggle`, true) private datePickerButton!: HTMLButtonElement;
  @query(`.close`, true) private closeButton!: HTMLButtonElement;
  @query(`date-calendar`, true) private calendar!: Calendar;
  @query(`[role="dialog"]`, true) private dialog!: HTMLElement;

  private formData = new FormDataController(this);
  private swipeController = new SwipeController(this, {
    target: () => this.dialog,
    onSwipeEnd: ({ distanceX, distanceY }) => {
      const threshold = 70;
      const isDownwardsSwipe = Math.abs(distanceY) >= threshold && Math.abs(distanceX) <= threshold && distanceY > 0;

      if (isDownwardsSwipe) {
        this.hide(false);
        // todo: prevent scrolling?
        // event.preventDefault();
      }
    },
  });

  /**
   * Whilst dateAdapter is used for handling the formatting/parsing dates in the input,
   * these are used to format dates exclusively for the benefit of screen readers.
   *
   * We prefer DateTimeFormat over date.toLocaleDateString, as the former has
   * better performance when formatting large number of dates. See:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Performance
   */
  private dateFormatLong!: Intl.DateTimeFormat;

  /**
   * TODO: write explainer about why this is the source of truth, and not `value`
   */
  @state() inputValue: string = '';
  @state() open = false;

  /**
   * Name of the date picker input.
   */
  @property() name: string = '';

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
   * Placeholder value for the input.
   */
  @property() placeholder: string = '';

  /**
   * Date adapter, for custom parsing/formatting.
   * Must be object with a `parse` function which accepts a `string` and returns a `Date`,
   * and a `format` function which accepts a `Date` and returns a `string`.
   * Default is IS0-8601 parsing and formatting.
   */
  @property({ attribute: false }) dateAdapter: DateAdapter = isoAdapter;

  /**
   * Date value. Must be in IS0-8601 format: YYYY-MM-DD.
   */
  set value(value: string) {
    const oldVal = this.value;
    const date = parseISODate(value);
    this.valueAsDate = date;

    this.requestUpdate('value', oldVal);
  }

  @property()
  get value(): string {
    const date = this.valueAsDate;
    return date ? printISODate(date) : '';
  }

  /**
   * Get the value as a date object.
   */
  get valueAsDate(): Date | undefined {
    const { parse } = this.dateAdapter;
    return typeof parse === 'function' ? parse(this.inputValue, createDate) : parseFromRegex(parse, this.inputValue);
  }

  /**
   * Set the value as a date object.
   */
  set valueAsDate(date: Date | undefined) {
    if (!date) {
      this.inputValue = '';
    } else {
      const { format } = this.dateAdapter;
      this.inputValue = typeof format === 'function' ? format(date) : formatFromString(format, date);
    }
  }

  /**
   * Get the value as a number of milliseconds. Returns NaN if date is invalid.
   */
  get valueAsNumber(): number {
    const date = this.valueAsDate;
    return date ? date.getTime() : NaN;
  }

  /**
   * Set the value as a number of milliseconds.
   */
  set valueAsNumber(date: number) {
    this.valueAsDate = new Date(date);
  }

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

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('localization')) {
      this.dateFormatLong = new Intl.DateTimeFormat(this.localization.locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  /**
   * Show the calendar modal, moving focus to the calendar inside.
   */
  show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('date-picker-open'));

    // we need to wait for the element to become visible after next render,
    // before we can move focus. it won't work otherwise
    this.updateComplete.then(() => this.calendar.focus());
  }

  /**
   * Hide the calendar modal. Set `moveFocusToButton` to false to prevent focus
   * returning to the date picker's button. Default is true.
   */
  hide(moveFocusToButton = true) {
    this.open = false;
    this.dispatchEvent(new CustomEvent('date-picker-close'));

    if (moveFocusToButton) {
      this.datePickerButton.focus();
    }
  }

  render() {
    const { valueAsDate } = this;

    return html`
      <div class="input-wrapper">
        <input
          .value=${this.inputValue}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required ? true : undefined}
          aria-autocomplete="none"
          @input=${this.handleInputChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          autocomplete="off"
        />

        <button class="toggle" @click=${this.toggleOpen} ?disabled=${this.disabled} type="button">
          <span class="toggle-icon">${calendarIcon}</span>
          <span class="v-hidden">
            ${this.localization.buttonLabel}
            ${valueAsDate
              ? html`<span>, ${this.localization.selectedDateMessage} ${this.dateFormatLong.format(valueAsDate)}</span>`
              : nothing}
          </span>
        </button>
      </div>

      <div
        class=${classMap({
          'is-left': this.direction === 'left',
        })}
        role="dialog"
        aria-modal="true"
        aria-hidden=${this.open ? 'false' : 'true'}
        aria-labelledby="dialog-heading"
      >
        <div class="dialog-content" @keydown=${this.handleEscKey}>
          <div tabindex="0" @focus=${this.focusLast}></div>

          <div class="mobile">
            <div id="dialog-heading" class="mobile-heading">${this.localization.calendarHeading}</div>
            <button class="close" @click=${() => this.hide()} type="button">
              ${closeIcon}
              <span class="v-hidden">${this.localization.closeLabel}</span>
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
    `;
  }

  private toggleOpen = (e: Event) => {
    e.preventDefault();

    if (this.open) {
      this.hide(false);
    } else {
      this.show();
    }
  };

  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.open) {
      return;
    }

    const isClickOutside = e.composedPath().every(node => node !== this.calendar && node !== this.datePickerButton);

    if (isClickOutside) {
      this.hide(false);
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

  private focusFirst = () => {
    this.closeButton.focus();
  };

  private focusLast = () => {
    this.calendar.focus();
  };

  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const oldValue = this.value;

    const { disallowedCharacters } = this.dateAdapter;
    this.inputValue = disallowedCharacters ? cleanValue(target, disallowedCharacters) : target.value;

    const newValue = this.value;

    if (oldValue !== newValue) {
      this.dispatchEvent(new CustomEvent('date-picker-change'));
    }
  };

  private handleDaySelect = (event: CustomEvent<{ valueAsDate: Date }>) => {
    this.valueAsDate = event.detail.valueAsDate;
    this.dispatchEvent(new CustomEvent('date-picker-change'));
    this.hide();
  };
}
