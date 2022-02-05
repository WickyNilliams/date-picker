import { html } from 'lit';

export const calendar = html`
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
`;

export const close = html`
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
`;
