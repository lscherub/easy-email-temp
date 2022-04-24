import { IEmailTemplate } from '@/typings';
import { makeAutoObservable } from 'mobx';

const MAX_RECORD_SIZE = 50;

type IEmailTemplateString = string;

export enum RecordStatus {
  'add' = 'add',
  'redo' = 'redo',
  'undo' = 'undo',
}

export const record = new (class {
  constructor() {
    makeAutoObservable(this);
  }

  records: Array<IEmailTemplateString> = [];
  recordIndex = -1;
  status: RecordStatus | undefined = undefined;

  setRecords = (records: Array<IEmailTemplateString>) => {
    this.records = records;
  };

  setStatus = (status: RecordStatus | undefined) => {
    this.status = status;
  };

  addRecord = (record: IEmailTemplate) => {
    this.setStatus(RecordStatus.add);
    this.recordIndex += 1;
    this.records = [
      ...this.records.slice(0, this.recordIndex),
      JSON.stringify(record),
    ];
  };

  setRecordIndex = (index: number) => {
    this.recordIndex = Math.max(
      Math.min(
        MAX_RECORD_SIZE - 1,
        this.recordIndex + index,
        this.records.length - 1
      ),
      0
    );
  };

  get currentData() {
    return this.records[this.recordIndex];
  }

  redo = (index: number = 1) => {
    this.setStatus(RecordStatus.redo);
    this.setRecordIndex(index);
    return JSON.parse(this.currentData) as IEmailTemplate;
  };

  undo = (index: number = 1) => {
    this.setStatus(RecordStatus.undo);
    this.setRecordIndex(-index);
    return JSON.parse(this.currentData) as IEmailTemplate;
  };

  get undoable() {
    return this.recordIndex > 0;
  }

  get redoable() {
    return this.recordIndex < this.records.length - 1;
  }

  get size() {
    return this.records.length;
  }

  get index() {
    return this.recordIndex;
  }
})();
