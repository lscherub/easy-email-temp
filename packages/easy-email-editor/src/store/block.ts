import { record, RecordStatus } from './record';
import { IEmailTemplate } from '@/typings';
import { makeAutoObservable, toJS } from 'mobx';
import { set } from 'lodash';

export const block = new (class {
  constructor() {
    makeAutoObservable(this);
  }

  initialized = false;

  _data: IEmailTemplate | null = null;

  get data() {
    if (!this._data) {
      throw new Error('Block data is not initialized');
    }
    return this._data;
  }

  setData = (val: IEmailTemplate) => {
    this._data = val;
    if (!this.initialized) {
      record.addRecord(val);
    }
    this.initialized = true;
  };

  update = (name: string, value: any) => {
    set(this.data, name, value);
    record.addRecord(this.data);
  };

  redo = (index: number = 1) => {
    const next = record.redo(index);
    this.setData(next);
  };

  undo = (index: number = 1) => {
    const prev = record.undo(index);
    this.setData(prev);
  };
})();
