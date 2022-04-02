import { escapeRegExp } from 'lodash';
import Type from './type';

export const matcher = /^(unit|unitWithNegative)\(.*\)/gim;

export default (params: string) => {
  const allowNeg = params.match(/^unitWithNegative/) ? '-|' : '';

  const units = params.match(/\(([^)]+)\)/)?.[1].split(',') as string[];
  const argsMatch = params.match(/\{([^}]+)\}/);
  const args = (argsMatch && argsMatch[1] && argsMatch[1].split(',')) || ['1']; // defaults to 1

  const allowAuto = units.includes('auto') ? '|auto' : '';
  const filteredUnits = units.filter((u) => u !== 'auto');

  return class Unit extends Type<string> {
    static errorMessage = `has invalid value: $value for type Unit, only accepts (${units.join(
      ', '
    )}) units and ${args.join(' to ')} value(s)`;

    constructor(value: string) {
      super(value);

      this.matchers = [
        new RegExp(
          `^(((${allowNeg}\\d|,|\\.){1,}(${filteredUnits
            .map(escapeRegExp)
            .join('|')})|0${allowAuto})( )?){${args.join(',')}}$`
        ),
      ];
    }
  };
};
