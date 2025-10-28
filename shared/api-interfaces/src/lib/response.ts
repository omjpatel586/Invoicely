export interface IResponse<T = object> {
  data: T;
  message: string;
  statusCode: number;
}
