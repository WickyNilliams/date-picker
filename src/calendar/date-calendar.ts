import { Calendar } from './Calendar.js';

window.customElements.define('date-calendar', Calendar);

declare global {
  interface HTMLElementTagNameMap {
    'date-calendar': Calendar;
  }
}
