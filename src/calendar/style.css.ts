import { css } from 'lit';

export const style = css`
  /* ---------------------------------------------
  // TABLE
  // -------------------------------------------- */

  table {
    border-collapse: collapse;
    border-spacing: 0;
    color: var(--date-picker-color-text);
    font-size: 1rem;
    font-weight: var(--date-picker-font-normal);
    line-height: 1.25;
    text-align: center;
    width: 100%;
  }

  th {
    font-size: 0.75rem;
    font-weight: var(--date-picker-font-bold);
    letter-spacing: 1px;
    line-height: 1.25;
    padding-bottom: 8px;
    text-decoration: none;
    text-transform: uppercase;
  }

  td {
    text-align: center;
  }

  .day {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: var(--date-picker-color-text);
    cursor: pointer;
    display: inline-block;
    font-family: var(--date-picker-font);
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    font-weight: var(--date-picker-font-normal);
    height: 36px;
    line-height: 1.25;
    padding: 0 0 1px;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 36px;
    z-index: 1;
  }

  .day[aria-current='date'] {
    box-shadow: 0 0 0 1px var(--date-picker-color-primary);
    position: relative;
    z-index: 200;
  }

  .day:hover::before,
  .day[aria-current='date']::before {
    background: var(--date-picker-color-primary);
    border-radius: 50%;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.06;
    position: absolute;
    right: 0;
    top: 0;
  }

  .day[aria-pressed='true'],
  .day:focus {
    background: var(--date-picker-color-primary);
    box-shadow: none;
    color: var(--date-picker-color-text-active);
    outline: 0;
  }

  .day:active {
    background: var(--date-picker-color-primary);
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    color: var(--date-picker-color-text-active);
    z-index: 200;
  }

  .day:focus {
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    z-index: 200;
  }

  .day:not(.is-month) {
    box-shadow: none;
  }

  .day:not(.is-month),
  .day[aria-disabled='true'] {
    background: transparent;
    color: var(--date-picker-color-text);
    cursor: default;
    opacity: 0.5;
  }

  .day[aria-disabled='true'][aria-current='date'] {
    box-shadow: 0 0 0 1px var(--date-picker-color-primary);
  }

  .day[aria-disabled='true'][aria-current='date']:focus {
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    background: var(--date-picker-color-primary);
    color: var(--date-picker-color-text-active);
  }

  .day[aria-disabled='true']:not([aria-current='date'])::before {
    display: none;
  }

  .day:disabled {
    background: var(--date-picker-color-button);
    box-shadow: none;
    color: var(--date-picker-color-text);
    cursor: default;
    opacity: 0.6;
    pointer-events: none;
  }

  .day:disabled::before {
    display: none;
  }

  /* ---------------------------------------------
  // HEADER
  // --------------------------------------------*/

  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    width: 100%;
  }

  /* ---------------------------------------------
  // NAVIGATION
  // --------------------------------------------*/

  .nav {
    white-space: nowrap;
  }

  .nav button {
    -moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    appearance: none;
    background: var(--date-picker-color-button);
    border: 0;
    border-radius: 50%;
    color: var(--date-picker-color-text);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    margin-left: 8px;
    padding: 0;
    transition: background-color 300ms ease;
    width: 32px;
  }

  @media (max-width: 35.9375em) {
    .nav button {
      height: 40px;
      width: 40px;
    }
  }

  .nav button:focus {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
    outline: 0;
  }

  .nav button:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .nav button:active:focus {
    box-shadow: none;
  }

  .nav svg {
    height: 21px;
    width: 21px;
    margin: 0 auto;
  }

  /* ---------------------------------------------
  // SELECT
  // --------------------------------------------*/

  .select {
    display: inline-flex;
    margin-top: 4px;
    position: relative;
  }

  .select select {
    cursor: pointer;
    font-size: 1rem;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
  }

  .select-label {
    align-items: center;
    border-radius: var(--date-picker-radius);
    color: var(--date-picker-color-text);
    display: flex;
    font-size: 1.25rem;
    font-weight: var(--date-picker-font-bold);
    line-height: 1.25;
    padding: 0 4px 0 8px;
    pointer-events: none;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .select-label span {
    margin-right: 4px;
  }

  .select-label svg {
    width: 16px;
    height: 16px;
  }

  .select select:focus + .select-label {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
  }

  /* ---------------------------------------------
  // VISUALLY HIDDEN
  // --------------------------------------------*/

  .v-hidden {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 0;
    width: 1px;
  }
`;
