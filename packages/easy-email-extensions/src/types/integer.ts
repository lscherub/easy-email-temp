import Type from './type';

export const matcher = /^integer/gim;

export default () =>
  class NInteger extends Type<number> {
    constructor(value: number) {
      super(value);

      this.matchers = [/\d+/];
    }
  };
