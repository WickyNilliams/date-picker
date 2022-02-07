import { elementUpdated, expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
// import { visualDiff } from '@web/test-runner-visual-regression';
import { createSpy } from '../utils/spy.js';

import { DatePicker } from './DatePicker.js';
import './date-picker.js';

import { DateAdapter } from './date-adapter.js';
import { en as localization } from './localization.js';

/**
 * Gets the currently focused element, taking shadow roots into account.
 */
export function getFocusedElement(root: Document | ShadowRoot): Element | undefined {
  if (root.activeElement?.shadowRoot) {
    return getFocusedElement(root.activeElement.shadowRoot);
  }

  return root.activeElement || undefined;
}

function getChooseDateButton(picker: DatePicker) {
  return picker.shadowRoot!.querySelector<HTMLButtonElement>('.toggle')!;
}

function getInput(page: DatePicker) {
  return page.shadowRoot!.querySelector('input')!;
}

function getDialog(page: DatePicker) {
  return page.shadowRoot!.querySelector(`[role="dialog"]`)!;
}

function getCalendar(picker: DatePicker) {
  return picker.shadowRoot!.querySelector('date-calendar')!;
}

function getGrid(page: DatePicker) {
  const calendar = getCalendar(page);
  return calendar.shadowRoot!.querySelector('table')!;
}

function getMonthDropdown(page: DatePicker) {
  const calendar = getCalendar(page);
  return calendar.shadowRoot!.querySelector<HTMLSelectElement>('.select--month')!;
}

async function setMonthDropdown(page: DatePicker, month: string) {
  const calendar = getCalendar(page);
  const select = getMonthDropdown(page);
  select.value = month;
  select.dispatchEvent(new Event('change'));
  await elementUpdated(calendar);
}

function getYearDropdown(page: DatePicker) {
  const calendar = getCalendar(page);
  return calendar.shadowRoot!.querySelector<HTMLSelectElement>('.select--year')!;
}

async function setYearDropdown(page: DatePicker, year: string) {
  const calendar = getCalendar(page);
  const select = getYearDropdown(page);
  select.value = year;
  select.dispatchEvent(new Event('change'));
  await elementUpdated(calendar);
}

function getPrevMonthButton(page: DatePicker) {
  const calendar = getCalendar(page);
  return calendar.shadowRoot!.querySelector<HTMLButtonElement>('.prev')!;
}

function getNextMonthButton(page: DatePicker) {
  const calendar = getCalendar(page);
  return calendar.shadowRoot!.querySelector<HTMLButtonElement>('.next')!;
}

async function clickDay(page: DatePicker, date: string) {
  const grid = getGrid(page);
  const button = grid.querySelector<HTMLButtonElement>(`button[aria-label="${date}"]`)!;
  button.click();

  await elementUpdated(page);
}

async function openCalendar(page: DatePicker) {
  const button = getChooseDateButton(page);
  button.click();

  await elementUpdated(page);
  const dialog = getDialog(page);
  await waitUntil(() => dialog.getAttribute('aria-hidden') === 'false');
}

function isCalendarOpen(page: DatePicker): boolean {
  const dialog = getDialog(page);
  return dialog.getAttribute('aria-hidden') === 'false';
}

async function clickOutside(page: DatePicker) {
  document.dispatchEvent(new Event('click'));
  await elementUpdated(page);
}

function getYearOptions(page: DatePicker) {
  const select = getYearDropdown(page);
  return Array.from(select.options).map(option => option.value);
}

type DatePickerProps = {
  min: string;
  max: string;
  value: string;
  onChange: EventListener;
  onClose: EventListener;
  onOpen: EventListener;
  onBlur: EventListener;
  onFocus: EventListener;
};

const createFixture = async ({
  onBlur,
  onFocus,
  onChange,
  onOpen,
  onClose,
  ...props
}: Partial<DatePickerProps> = {}): Promise<DatePicker> => {
  const picker = await fixture<DatePicker>(
    html`<date-picker
      @date-picker-open=${onOpen}
      @date-picker-close=${onClose}
      @date-picker-focus=${onFocus}
      @date-picker-blur=${onBlur}
      @date-picker-change=${onChange}
    ></date-picker>`
  );
  return Object.assign(picker, props);
};

describe('duet-date-picker', () => {
  describe('mouse interaction', () => {
    it('should open on button click', async () => {
      const page = await createFixture();

      expect(isCalendarOpen(page)).to.eq(false);
      await openCalendar(page);
      expect(isCalendarOpen(page)).to.eq(true);
    });

    it('should close on click outside', async () => {
      const page = await createFixture();

      await openCalendar(page);
      expect(isCalendarOpen(page)).to.eq(true);

      await clickOutside(page);
      expect(isCalendarOpen(page)).to.eq(false);
    });

    it('supports selecting a date in the future', async () => {
      const spy = createSpy();
      const picker = await createFixture({ value: '2020-01-01', onChange: spy });
      const calendar = getCalendar(picker);
      await openCalendar(picker);

      const nextMonth = getNextMonthButton(picker);

      nextMonth.click();
      nextMonth.click();
      nextMonth.click();
      await elementUpdated(calendar);
      await clickDay(picker, '19 April');

      expect(spy.count).to.eq(1);
      expect(spy.first[0].target).to.include({ value: '2020-04-19' });
    });

    it('supports selecting a date in the past', async () => {
      const spy = createSpy();
      const picker = await createFixture({ value: '2020-01-01', onChange: spy });
      await openCalendar(picker);

      await setMonthDropdown(picker, '3');
      await setYearDropdown(picker, '2019');
      await clickDay(picker, '19 April');

      expect(spy.count).to.eq(1);
      expect(picker.value).to.eq('2019-04-19');
    });
  });

  // see: https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
  describe('a11y/ARIA requirements', () => {
    describe('button', () => {
      it('has an accessible label', async () => {
        const page = await createFixture();
        const button = getChooseDateButton(page);
        const element = button.querySelector('.v-hidden');

        expect(element).to.have.trimmed.text(localization.buttonLabel);
      });
    });

    describe('dialog', () => {
      it('meets a11y requirements', async () => {
        const page = await createFixture();
        const dialog = getDialog(page);

        // has aria-modal attr
        expect(dialog).to.have.attribute('aria-modal', 'true');

        // has accessible label
        const labelledById = dialog.getAttribute('aria-labelledby');
        const title = page.shadowRoot!.querySelector(`#${labelledById}`);
        expect(title).not.to.eq(null);
      });
    });

    describe('grid', () => {
      it('meets a11y requirements', async () => {
        const page = await createFixture({ value: '2020-01-01' });
        const grid = getGrid(page);
        const calendar = getCalendar(page);

        // has accessible label
        const labelledById = grid.getAttribute('aria-labelledby');
        const title = calendar.shadowRoot!.querySelector(`#${labelledById}`);
        expect(title).not.to.eq(null);

        await openCalendar(page);

        // should be single selected element
        const selected = grid.querySelectorAll(`[aria-pressed="true"]`);
        expect(selected.length).to.eq(1);

        // only one button is in focus order, has accessible label, and correct text content
        expect(selected[0]).to.have.attribute('tabindex', '0');
        expect(selected[0]).to.have.attribute('aria-label', '1 January');
      });

      it('correctly abbreviates the shortened day names');
    });

    describe('controls', () => {
      it('has a label for next month button');
      it('has a label for previous month button');
      it('has a label for the month select dropdown');
      it('has a label for the year select dropdown');
    });
  });

  describe('keyboard a11y', () => {
    it('closes on ESC press', async () => {
      const page = await createFixture();

      await openCalendar(page);
      expect(isCalendarOpen(page)).to.eq(true);

      await sendKeys({ press: 'Escape' });
      expect(isCalendarOpen(page)).to.eq(false);
    });

    it('supports selecting a date in the future', async () => {
      const spy = createSpy();
      const picker = await createFixture({ value: '2020-01-01', onChange: spy });

      // open calendar
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });

      // set month to april
      await setMonthDropdown(picker, '3');

      // tab to grid, select 19th of month
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });

      expect(spy.count).to.eq(1);
    });

    it('supports selecting a date in the past', async () => {
      const spy = createSpy();
      const page = await createFixture({ value: '2020-01-01', onChange: spy });

      // open calendar
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });

      // select april from month dropdown
      await setMonthDropdown(page, '3');

      // tab to year dropdown, select 2019
      await setYearDropdown(page, '2019');

      // select date 19th of month
      await sendKeys({ press: 'ArrowDown' });

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });

      expect(spy.count).to.eq(1);
    });

    it('supports navigating to disabled dates', async () => {
      const spy = createSpy();
      const page = await createFixture({ value: '2020-01-01', onChange: spy });

      page.isDateDisabled = function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
      };

      // open calendar
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });

      // set month to april
      await setMonthDropdown(page, '3');

      // navigate to 2. april thursday
      await sendKeys({ press: 'ArrowRight' });
      // navigate to 3. april friday
      await sendKeys({ press: 'ArrowRight' });
      // navigate to 4. april saturday
      await sendKeys({ press: 'ArrowRight' });

      await sendKeys({ press: 'Enter' });
      expect(spy.called).to.eq(false);

      // navigate to 5. april sunday
      await sendKeys({ press: 'ArrowRight' });

      await sendKeys({ press: 'Enter' });
      expect(spy.called).to.eq(false);

      // navigate to 6. april monday
      await sendKeys({ press: 'ArrowRight' });

      await sendKeys({ press: 'Enter' });

      expect(spy.count).to.eq(1);
    });

    it('moves focus to start of week on home press');
    it('moves focus to end of week end press');

    it('moves focus to previous month on page up press');
    it('moves focus to next month on page down press');

    it('moves focus to previous year on shift + page down press');
    it('moves focus to next year on shift + page down press');

    it('maintains curosor position when typing disallowed characters', async () => {
      const page = await createFixture();
      const input = getInput(page);
      const DATE = '2020-03-19';

      // tab to input
      await sendKeys({ press: 'Tab' });

      // type some _allowed_ chars
      await sendKeys({ type: DATE });

      // move cursor so we can test maintaining position
      await sendKeys({ press: 'ArrowLeft' });

      // store cursor position
      const cursorBefore = input.selectionStart;
      expect(cursorBefore).to.eq(DATE.length - 1);

      // attempt to enter _disallowed_ character
      await sendKeys({ press: 'a' });

      const cursorAfter = input.selectionStart;

      // we should see cursor hasn't changed
      expect(cursorAfter).to.eq(cursorBefore);

      // and value contains no disallowed chars
      expect(input.value).to.eq(DATE);
    });
  });

  describe('events', () => {
    it('raises a focus event when the input is focused', async () => {
      const spy = createSpy();
      await createFixture({ onFocus: spy });

      await sendKeys({ press: 'Tab' });

      expect(spy.count).to.eq(1);
    });

    it('raises a blur event when the input is blurred', async () => {
      const spy = createSpy();
      await createFixture({ onBlur: spy });

      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(spy.count).to.eq(1);
    });

    it('raises an open event on open', async () => {
      const spy = createSpy();
      const picker = await createFixture({ onOpen: spy });

      picker.show();
      expect(spy.count).to.eq(1);
    });

    it('raises a close event on close', async () => {
      const spy = createSpy();
      const picker = await createFixture({ onClose: spy });

      picker.hide();
      expect(spy.count).to.eq(1);
    });
  });

  describe('focus management', () => {
    it('traps focus in calendar', async () => {
      const picker = await createFixture();

      await openCalendar(picker);

      // day
      let focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.attribute('tabindex', '0');

      // close button
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.trimmed.text(localization.closeLabel);

      // month dropdown
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.attribute('aria-label', localization.monthSelectLabel);

      // year dropdown
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.attribute('aria-label', localization.yearSelectLabel);

      // prev month
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.trimmed.text(localization.prevMonthLabel);

      // next month
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.trimmed.text(localization.nextMonthLabel);

      // back to day
      await sendKeys({ press: 'Tab' });
      focused = getFocusedElement(picker.shadowRoot!);
      expect(focused).to.have.attribute('tabindex', '0');
    });

    it("doesn't shift focus when interacting with calendar navigation controls");
    it('shifts focus back to button on date select');
    it('shifts focus back to button on ESC press');
    it("doesn't shift focus to button on click outside");
  });

  describe('min/max support', () => {
    it('supports a min date', async () => {
      const spy = createSpy();
      const page = await createFixture({ value: '2020-01-15', min: '2020-01-02', onChange: spy });

      await openCalendar(page);

      // make sure it's rendered correctly
      // We use a slightly higher threshold here since the CSS transition
      // makes certain parts move slightly depending on how the browser converts
      // the percentage based units into pixels.
      // const screenshot = await page.screenshot();
      // expect(screenshot).toMatchImageSnapshot({
      //   failureThreshold: 0.001,
      //   failureThresholdType: 'percent',
      // });

      // try clicking a day outside the range
      await clickDay(page, '1 January');
      expect(spy.called).to.eq(false);

      // click a day inside the range
      await clickDay(page, '2 January');

      expect(spy.count).to.eq(1);
    });

    it('supports a max date', async () => {
      const spy = createSpy();
      const page = await createFixture({ value: '2020-01-15', max: '2020-01-30', onChange: spy });

      await openCalendar(page);

      // TODO: setup visual diff properly
      // make sure it's rendered correctly
      // We use a slightly higher threshold here since the CSS transition
      // makes certain parts move slightly depending on how the browser converts
      // the percentage based units into pixels.
      // const screenshot = await page.screenshot();
      // expect(screenshot).toMatchImageSnapshot({
      //   failureThreshold: 0.001,
      //   failureThresholdType: 'percent',
      // });

      // try clicking a day outside the range
      await clickDay(page, '31 January');
      expect(spy.called).to.eq(false);

      // click a day inside the range
      await clickDay(page, '30 January');

      expect(spy.count).to.eq(1);
    });

    it('supports min and max dates', async () => {
      const spy = createSpy();
      const page = await createFixture({ value: '2020-01-15', min: '2020-01-02', max: '2020-01-30', onChange: spy });

      await openCalendar(page);

      // TODO: setup visual diff properly
      // make sure it's rendered correctly.
      // We use a slightly higher threshold here since the CSS transition
      // makes certain parts move slightly depending on how the browser converts
      // the percentage based units into pixels.
      // const screenshot = await page.screenshot();
      // expect(screenshot).toMatchImageSnapshot({
      //   failureThreshold: 0.001,
      //   failureThresholdType: 'percent',
      // });

      // try clicking a day less than min
      await clickDay(page, '1 January');
      expect(spy.called).to.eq(false);

      // try clicking a day greater than max
      await clickDay(page, '31 January');
      expect(spy.called).to.eq(false);

      // click a day inside the range
      await clickDay(page, '30 January');

      expect(spy.count).to.eq(1);
    });

    it('disables prev month button if same month and year as min', async () => {
      const page = await createFixture({ value: '2020-04-19', min: '2020-04-01' });

      await openCalendar(page);

      const prevMonthButton = getPrevMonthButton(page);
      expect(prevMonthButton).to.have.attribute('disabled');
    });

    it('disables next month button if same month and year as max', async () => {
      const page = await createFixture({ value: '2020-04-19', max: '2020-04-30' });

      await openCalendar(page);

      const nextMonthButton = getNextMonthButton(page);
      expect(nextMonthButton).to.have.attribute('disabled');
    });

    it('does not disable prev/next buttons when only month value (but not year) is same as min and max', async () => {
      // there was a bug whereby both buttons would be disabled if the min/max/selected date
      // had the same month (here: 4), but different years. this tests ensures no regression
      const page = await createFixture({ value: '2020-04-19', min: '2019-04-19', max: '2021-04-19' });

      await openCalendar(page);

      const prevMonthButton = getPrevMonthButton(page);
      const nextMonthButton = getNextMonthButton(page);

      expect(prevMonthButton).not.to.have.attribute('disabled');
      expect(nextMonthButton).not.to.have.attribute('disabled');
    });

    it('respects min/max dates when generating year dropdown', async () => {
      const page = await createFixture({ value: '2020-04-19', min: '2019-04-19', max: '2021-04-19' });
      await openCalendar(page);

      // range smaller than default 40 year range
      let options = getYearOptions(page);
      expect(options).to.eql(['2019', '2020', '2021']);

      // range larger than default 40 year range
      const minYear = 1990;
      const maxYear = 2050;
      page.setAttribute('min', `${minYear}-01-02`);
      page.setAttribute('max', `${maxYear}-01-30`);
      await elementUpdated(page);

      options = getYearOptions(page);

      expect(options.length).to.eq(maxYear - minYear + 1);
      expect(options[0]).to.eq(minYear.toString());
      expect(options[options.length - 1]).to.eq(maxYear.toString());
    });

    it('respects min/max dates when generating month dropdown', async () => {
      const page = await createFixture({ value: '2020-04-19', min: '2019-04-01', max: '2020-05-31' });

      await openCalendar(page);

      function getAllowedMonths() {
        const select = getMonthDropdown(page);
        return Array.from(select.options)
          .filter(option => !option.disabled)
          .map(option => option.value);
      }

      // in 2020, January - May is allowed
      let allowedMonths = getAllowedMonths();
      expect(allowedMonths).to.eql(['0', '1', '2', '3', '4']);

      await setYearDropdown(page, '2019');

      // in 2019, April - December is allowed
      allowedMonths = getAllowedMonths();
      expect(allowedMonths).to.eql(['3', '4', '5', '6', '7', '8', '9', '10', '11']);
    });
  });

  describe('methods', () => {
    it('should open calendar on show()', async () => {
      const page = await createFixture();

      expect(isCalendarOpen(page)).to.eq(false);

      page.show();
      await elementUpdated(page);

      expect(isCalendarOpen(page)).to.eq(true);
    });

    it('should close calendar on hide()', async () => {
      const page = await createFixture();

      page.show();
      await elementUpdated(page);
      expect(isCalendarOpen(page)).to.eq(true);

      page.hide();
      await elementUpdated(page);

      expect(isCalendarOpen(page)).to.eq(false);
    });

    it('should focus input on setFocus()', async () => {
      const page = await createFixture();

      page.focus();

      const focused = getFocusedElement(page.shadowRoot!);

      expect(focused).to.eq(getInput(page));
    });
  });

  describe('form interaction', () => {
    it.skip('supports required attribute', async () => {
      const spy = createSpy();

      const page = await fixture(html`
        <form @submit=${spy}>
          <date-picker required></date-picker>
          <button type="submit">submit</button>
        </form>
      `);

      const picker = page.querySelector('date-picker')!;
      const button = page.querySelector('button')!;

      button.click();

      expect(spy.called).to.eq(false);

      picker.value = '2020-01-01';
      button.click();

      expect(spy.count).to.eq(1);
    });

    it('always submits value as ISO date', async () => {
      // adapter for non-ISO date format (dd.mm.yyyy)
      const dateAdapter: DateAdapter = {
        parse(value = '', createDate) {
          const DATE_FORMAT = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
          const matches = value.match(DATE_FORMAT);
          return matches ? createDate(matches[3], matches[2], matches[1]) : undefined;
        },
        format(date) {
          return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        },
        disallowedCharacters: /[^0-9.]/,
      };

      const form = await fixture<HTMLFormElement>(html`
        <form>
          <date-picker name="test" value="2020-01-01" .dateAdapter=${dateAdapter}></date-picker>
        </form>
      `);

      const picker = form.querySelector('date-picker')!;
      const input = getInput(picker);

      // submitted value should be ISO format
      const formData = new FormData(form);
      expect(formData.get('test')).to.eq('2020-01-01');

      // whilst the displayed value should be Finnish format
      expect(input.value).to.eq('1.1.2020');
    });
  });
});
