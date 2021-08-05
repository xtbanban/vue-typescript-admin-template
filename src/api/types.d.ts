export interface ILoggingData {
  _id: string
  Login: string
  SWIP: string
  acc_code: string
  resp_code: string
  status_type: string
  logtime: Date
}

export interface IClientData {
  _id: string
  Login: string
  Password: string
  UserName: string
  SWIP: string
  status: boolean
}

export interface IClientListData {
  _id: string
  Login: string
  UserName: string
}

export interface IDeviceData {
  _id: string
  IP: string
  Secert: string
  AutoInsert: boolean
  AutoAccept: boolean
  name: string
  group: string
}
