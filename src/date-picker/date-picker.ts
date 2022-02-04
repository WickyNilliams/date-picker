import { DatePicker } from './DatePicker.js';

window.customElements.define('date-picker', DatePicker);

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': DatePicker;
  }
}
