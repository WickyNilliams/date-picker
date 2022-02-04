import { css } from 'lit';

export const style = css`
  /* ---------------------------------------------
  // DATE PICKER
  // ---------------------------------------------*/

  :host {
    display: block;
  }

  .date-picker *,
  .date-picker *::before,
  .date-picker *::after {
    box-sizing: border-box;
    margin: 0;
    width: auto;
  }

  .date-picker {
    box-sizing: border-box;
    color: var(--date-picker-color-text);
    display: block;
    font-family: var(--date-picker-font);
    margin: 0;
    position: relative;
    text-align: left;
    width: 100%;
  }

  /* ---------------------------------------------
  // DATE PICKER __ INPUT
  // --------------------------------------------*/

  .date-picker__input {
    -webkit-appearance: none;
    appearance: none;
    background: var(--date-picker-color-surface);
    border: 1px solid var(--date-picker-color-border, var(--date-picker-color-text));
    border-radius: var(--date-picker-radius);
    color: var(--date-picker-color-text);
    float: none;
    font-family: var(--date-picker-font);
    font-size: 100%;
    line-height: normal;
    padding: 14px 60px 14px 14px;
    width: 100%;
  }

  .date-picker__input:focus {
    border-color: var(--date-picker-color-primary);
    box-shadow: 0 0 0 1px var(--date-picker-color-primary);
    outline: 0;
  }

  .date-picker__input::-webkit-input-placeholder {
    color: var(--date-picker-color-placeholder);
    opacity: 1;
  }

  .date-picker__input:-moz-placeholder {
    color: var(--date-picker-color-placeholder);
    opacity: 1;
  }

  .date-picker__input:-ms-input-placeholder {
    color: var(--date-picker-color-placeholder);
  }

  .date-picker__input-wrapper {
    position: relative;
    width: 100%;
  }

  /* ---------------------------------------------
  // DATE PICKER __ TOGGLE
  // --------------------------------------------*/

  .date-picker__toggle {
    -moz-appearance: none;
    -webkit-appearance: none;
    -webkit-user-select: none;
    align-items: center;
    appearance: none;
    background: var(--date-picker-color-button);
    border: 0;
    border-radius: 0;
    border-bottom-right-radius: var(--date-picker-radius);
    border-top-right-radius: var(--date-picker-radius);
    box-shadow: inset 1px 0 0 rgba(0, 0, 0, 0.1);
    color: var(--date-picker-color-text);
    cursor: pointer;
    display: flex;
    height: calc(100% - 2px);
    justify-content: center;
    padding: 0;
    position: absolute;
    right: 1px;
    top: 1px;
    user-select: none;
    width: 48px;
    z-index: 2;
  }

  .date-picker__toggle:focus {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
    outline: 0;
  }

  .date-picker__toggle-icon {
    display: flex;
    flex-basis: 100%;
    justify-content: center;
    align-items: center;
  }

  /* ---------------------------------------------
  // DATE PICKER __ DIALOG
  // --------------------------------------------*/

  .date-picker__dialog {
    display: flex;
    left: 0;
    min-width: 320px;
    opacity: 0;
    position: absolute;
    top: 100%;
    transform: scale(0.96) translateZ(0) translateY(-20px);
    transform-origin: top right;
    transition: transform 300ms ease, opacity 300ms ease, visibility 300ms ease;
    visibility: hidden;
    width: 100%;
    will-change: transform, opacity, visibility;
    z-index: var(--date-picker-z-index);
  }

  @media (max-width: 35.9375em) {
    .date-picker__dialog {
      background: var(--date-picker-color-overlay);
      bottom: 0;
      position: fixed;
      right: 0;
      top: 0;
      transform: translateZ(0);
      transform-origin: bottom center;
    }
  }

  .date-picker__dialog.is-left {
    left: auto;
    right: 0;
    width: auto;
  }

  .date-picker__dialog.is-active {
    opacity: 1;
    transform: scale(1.0001) translateZ(0) translateY(0);
    visibility: visible;
  }

  .date-picker__dialog-content {
    background: var(--date-picker-color-surface);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--date-picker-radius);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    margin-left: auto;
    margin-top: 8px;
    max-width: 310px;
    min-width: 290px;
    padding: 16px 16px 20px;
    position: relative;
    transform: none;
    width: 100%;
    z-index: var(--date-picker-z-index);
  }

  @media (max-width: 35.9375em) {
    .date-picker__dialog-content {
      border: 0;
      border-radius: 0;
      border-top-left-radius: var(--date-picker-radius);
      border-top-right-radius: var(--date-picker-radius);
      bottom: 0;
      left: 0;
      margin: 0;
      max-width: none;
      min-height: 26em;
      opacity: 0;
      padding: 0 8% 20px;
      position: absolute;
      transform: translateZ(0) translateY(100%);
      transition: transform 400ms ease, opacity 400ms ease, visibility 400ms ease;
      visibility: hidden;
      will-change: transform, opacity, visibility;
    }

    .is-active .date-picker__dialog-content {
      opacity: 1;
      transform: translateZ(0) translateY(0);
      visibility: visible;
    }
  }

  /* ---------------------------------------------
  // DATE PICKER __ TABLE
  // --------------------------------------------*/

  .date-picker__table {
    border-collapse: collapse;
    border-spacing: 0;
    color: var(--date-picker-color-text);
    font-size: 1rem;
    font-weight: var(--date-picker-font-normal);
    line-height: 1.25;
    text-align: center;
    width: 100%;
  }

  .date-picker__table-header {
    font-size: 0.75rem;
    font-weight: var(--date-picker-font-bold);
    letter-spacing: 1px;
    line-height: 1.25;
    padding-bottom: 8px;
    text-decoration: none;
    text-transform: uppercase;
  }

  .date-picker__cell {
    text-align: center;
  }

  .date-picker__day {
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

  .date-picker__day.is-today {
    box-shadow: 0 0 0 1px var(--date-picker-color-primary);
    position: relative;
    z-index: 200;
  }

  .date-picker__day:hover::before,
  .date-picker__day.is-today::before {
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

  .date-picker__day[aria-pressed='true'],
  .date-picker__day:focus {
    background: var(--date-picker-color-primary);
    box-shadow: none;
    color: var(--date-picker-color-text-active);
    outline: 0;
  }

  .date-picker__day:active {
    background: var(--date-picker-color-primary);
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    color: var(--date-picker-color-text-active);
    z-index: 200;
  }

  .date-picker__day:focus {
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    z-index: 200;
  }

  .date-picker__day:not(.is-month) {
    box-shadow: none;
  }

  .date-picker__day:not(.is-month),
  .date-picker__day[aria-disabled='true'] {
    background: transparent;
    color: var(--date-picker-color-text);
    cursor: default;
    opacity: 0.5;
  }

  .date-picker__day[aria-disabled='true'].is-today {
    box-shadow: 0 0 0 1px var(--date-picker-color-primary);
  }

  .date-picker__day[aria-disabled='true'].is-today:focus {
    box-shadow: 0 0 5px var(--date-picker-color-primary);
    background: var(--date-picker-color-primary);
    color: var(--date-picker-color-text-active);
  }

  .date-picker__day[aria-disabled='true']:not(.is-today)::before {
    display: none;
  }

  .date-picker__day.is-outside {
    background: var(--date-picker-color-button);
    box-shadow: none;
    color: var(--date-picker-color-text);
    cursor: default;
    opacity: 0.6;
    pointer-events: none;
  }

  .date-picker__day.is-outside::before {
    display: none;
  }

  /* ---------------------------------------------
  // DATE PICKER __ HEADER
  // --------------------------------------------*/

  .date-picker__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    width: 100%;
  }

  /* ---------------------------------------------
  // DATE PICKER __ NAVIGATION
  // --------------------------------------------*/

  .date-picker__nav {
    white-space: nowrap;
  }

  .date-picker__prev,
  .date-picker__next {
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
    .date-picker__prev,
    .date-picker__next {
      height: 40px;
      width: 40px;
    }
  }

  .date-picker__prev:focus,
  .date-picker__next:focus {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
    outline: 0;
  }

  .date-picker__prev:active:focus,
  .date-picker__next:active:focus {
    box-shadow: none;
  }

  .date-picker__prev:disabled,
  .date-picker__next:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .date-picker__prev svg,
  .date-picker__next svg {
    margin: 0 auto;
  }

  /* ---------------------------------------------
  // DATE PICKER __ SELECT
  // --------------------------------------------*/

  .date-picker__select {
    display: inline-flex;
    margin-top: 4px;
    position: relative;
  }

  .date-picker__select span {
    margin-right: 4px;
  }

  .date-picker__select select {
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

  .date-picker__select select:focus + .date-picker__select-label {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
  }

  .date-picker__select-label {
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

  .date-picker__select-label svg {
    width: 16px;
    height: 16px;
  }

  /* ---------------------------------------------
  // DATE PICKER __ MOBILE
  // --------------------------------------------*/

  .date-picker__mobile {
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-left: -10%;
    overflow: hidden;
    padding: 12px 20px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120%;
  }

  @media (min-width: 36em) {
    .date-picker__mobile {
      border: 0;
      margin: 0;
      overflow: visible;
      padding: 0;
      position: absolute;
      right: -8px;
      top: -8px;
      width: auto;
    }
  }

  .date-picker__mobile-heading {
    display: inline-block;
    font-weight: var(--date-picker-font-bold);
    max-width: 84%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 36em) {
    .date-picker__mobile-heading {
      display: none;
    }
  }

  /* ---------------------------------------------
  // DATE PICKER __ CLOSE
  // --------------------------------------------*/

  .date-picker__close {
    -webkit-appearance: none;
    align-items: center;
    appearance: none;
    background: var(--date-picker-color-button);
    border: 0;
    border-radius: 50%;
    color: var(--date-picker-color-text);
    cursor: pointer;
    display: flex;
    height: 24px;
    justify-content: center;
    padding: 0;
    width: 24px;
  }

  @media (min-width: 36em) {
    .date-picker__close {
      opacity: 0;
    }
  }

  .date-picker__close:focus {
    box-shadow: 0 0 0 2px var(--date-picker-color-primary);
    outline: none;
  }

  @media (min-width: 36em) {
    .date-picker__close:focus {
      opacity: 1;
    }
  }

  .date-picker__close svg {
    margin: 0 auto;
  }

  /* ---------------------------------------------
  // DATE PICKER __ VISUALLY HIDDEN
  // --------------------------------------------*/

  .date-picker__vhidden {
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
