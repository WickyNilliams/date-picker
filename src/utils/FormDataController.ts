import { ReactiveController, ReactiveControllerHost } from 'lit';

export class FormDataController implements ReactiveController {
  constructor(private host: HTMLElement & ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.form?.addEventListener('formdata', this.handleFormData);
  }

  hostDisconnected() {
    this.form?.removeEventListener('formdata', this.handleFormData);
  }

  get form(): HTMLFormElement | null {
    return this.host.closest('form');
  }

  protected handleFormData = (e: FormDataEvent) => {
    const host = this.host as unknown as { disabled: boolean; value: string; name: string };

    if (!host.disabled) {
      e.formData.append(host.name, host.value);
    }
  };
}
