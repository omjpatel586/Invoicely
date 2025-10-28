import { Provider } from '@invoicely/constants';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile: string;
  provider: Provider;
}
