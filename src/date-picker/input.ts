import { html, nothing } from 'lit';
import { ref } from 'lit/directives/ref.js';
import { LocalizedText } from './localization.js';

type DatePickerInputProps = {
  value: string;
  formattedValue: string;
  valueAsDate?: Date;
  localization: LocalizedText;
  name: string;
  identifier: string;
  disabled: boolean;
  required: boolean;
  dateFormatter: Intl.DateTimeFormat;
  onClick: (event: MouseEvent) => void;
  onInput: (event: InputEvent) => void;
  onBlur: (event: FocusEvent) => void;
  onFocus: (event: FocusEvent) => void;
  buttonRef: (element: HTMLButtonElement) => void;
  inputRef: (element: HTMLInputElement) => void;
};

export function DatePickerInput({
  onClick,
  dateFormatter,
  localization,
  name,
  formattedValue,
  valueAsDate,
  value,
  identifier,
  disabled,
  required,
  buttonRef,
  inputRef,
  onInput,
  onBlur,
  onFocus,
}: DatePickerInputProps) {
  return html`
    <div class="date-picker__input-wrapper">
      <input
        class="date-picker__input"
        .value=${formattedValue}
        placeholder=${localization.placeholder}
        id=${identifier}
        ?disabled=${disabled}
        ?required=${required ? true : undefined}
        aria-autocomplete="none"
        @input=${onInput}
        @focus=${onFocus}
        @blur=${onBlur}
        autocomplete="off"
        ${ref(el => inputRef(el as HTMLInputElement))}
      />
      <input type="hidden" name=${name} .value=${value} />
      <button
        class="date-picker__toggle"
        @click=${onClick}
        ?disabled=${disabled}
        ${ref(el => buttonRef(el as HTMLButtonElement))}
        type="button"
      >
        <span class="date-picker__toggle-icon">
          <svg aria-hidden="true" height="24" viewBox="0 0 21 21" width="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd" transform="translate(2 2)">
              <path
                d="m2.5.5h12c1.1045695 0 2 .8954305 2 2v12c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-12c0-1.1045695.8954305-2 2-2z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="m.5 4.5h16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              <g fill="currentColor">
                <circle cx="8.5" cy="8.5" r="1" />
                <circle cx="4.5" cy="8.5" r="1" />
                <circle cx="12.5" cy="8.5" r="1" />
                <circle cx="8.5" cy="12.5" r="1" />
                <circle cx="4.5" cy="12.5" r="1" />
                <circle cx="12.5" cy="12.5" r="1" />
              </g>
            </g>
          </svg>
        </span>
        <span class="date-picker__vhidden">
          ${localization.buttonLabel}
          ${valueAsDate
            ? html`<span> , ${localization.selectedDateMessage} ${dateFormatter.format(valueAsDate)} </span>`
            : nothing}
        </span>
      </button>
    </div>
  `;
}
