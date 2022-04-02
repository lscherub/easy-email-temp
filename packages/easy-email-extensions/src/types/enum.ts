import { escapeRegExp } from 'lodash';
import Type from './type';

export const matcher = /^enum/gim;

export default (params: string) => {
  const matchers = params.match(/\(([^)]+)\)/)?.[1].split(',') as string[];

  return class Enum extends Type<string> {
    static errorMessage = `has invalid value: $value for type Enum, only accepts ${matchers.join(
      ', '
    )}`;

    constructor(value: string) {
      super(value);

      this.matchers = matchers.map((m) => new RegExp(`^${escapeRegExp(m)}$`));
    }
  };
};
