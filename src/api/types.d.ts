export interface ILoggingData {
  _id: string
  Login: string
  SWIP: string
  'acc_code': string
  'resp_code': string
  status: string
  logtime: string
}

export interface IClientData {
  _id: string
  Login: string
  Password: string
  UserName: string
  SWIP: string
  status: boolean
}

export interface IDeviceData {
  _id: string
  IP: string
  Secert: string
  AutoInsert: number
  AutoAccept: number
  name: string
  group: string
  status: number
}

export interface IGroupData {
  _id: string
  groupname: string
  address: string
  manager: string
  mobile: string
}
