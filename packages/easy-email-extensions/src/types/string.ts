import Type from './type';

export const matcher = /^string/gim;

export default () =>
  class NString extends Type<string> {
    constructor(value: string) {
      super(value);

      this.matchers = [/.*/];
    }
  };
