import { makeAutoObservable } from 'mobx';
import { getPageIdx } from 'easy-email-core';

export interface DataTransfer {
  type: string;
  payload?: any;
  action: 'add' | 'move';
  positionIndex?: number;
  parentIdx?: string;
  sourceIdx?: string;
}

export const blockState = new class {

  constructor() {
    makeAutoObservable(this);
  }

  focusIdx: string = getPageIdx();

  setFocusIdx = (idx: string) => {
    this.focusIdx = idx;
  };

  hoverIdx: string = '';

  setHoverIdx = (idx: string) => {
    this.hoverIdx = idx;
  };

  isDragging: boolean = false;

  setIsDragging = (flag: boolean) => {
    this.isDragging = flag;
  };

  direction: string = '';

  setDirection = (direction: string) => {
    this.direction = direction;
  };

  dataTransfer: DataTransfer | null = null;

  setDataTransfer = (dataTransfer: DataTransfer | null) => {
    this.dataTransfer = dataTransfer;
  };
};