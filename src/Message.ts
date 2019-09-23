export enum MessageType {
  CurrentValue = 'current_value',
  Leave = 'leave',
  RequestCurrentValue = 'request_current_value',
  Reset = 'reset',
}

export interface RequestCurrentValue {
  type: MessageType.RequestCurrentValue;
}

export interface CurrentValue {
  type: MessageType.CurrentValue;
  clientId: string;
  name: string;
  value: string | undefined;
}

export interface Reset {
  type: MessageType.Reset;
}

export interface Leave {
  type: MessageType.Leave;
  clientId: string;
}

export type Message = RequestCurrentValue | CurrentValue | Reset | Leave;
