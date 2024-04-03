export type ApiData<T = object> =
  | { isSuccess: false; message: string }
  | ({ isSuccess: true } & T);
