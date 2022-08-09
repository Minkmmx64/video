export interface ISession{
  session: {
    code: string;
  }
}

export interface ISessionStorage{
  sessionStore: {
    sessions: string
  }
}

export interface IRegister{
  email: string;
  mobilephone: string;
  password: string;
  username: string;
}