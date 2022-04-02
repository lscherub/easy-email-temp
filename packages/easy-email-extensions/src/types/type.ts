import { some } from 'lodash';
export default class Type<T extends string | number | boolean> {
  matchers: RegExp[] = [];
  value: T;

  errorMessage?: string;

  constructor(value: T) {
    this.value = value;
  }

  isValid = () => {
    return some(this.matchers, (matcher) => `${this.value}`.match(matcher));
  };

  getErrorMessage = () => {
    if (this.isValid()) {
      return;
    }

    const errorMessage =
      this.errorMessage ||
      `has invalid value: ${this.value} for type ${this.constructor.name} `;

    return errorMessage.replace(/\$value/g, this.value.toString());
  };

  getValue = () => {
    return this.value;
  };
}
