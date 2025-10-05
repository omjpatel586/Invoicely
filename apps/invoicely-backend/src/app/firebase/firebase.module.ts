import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE } from '../utils/constants';

const serviceAccount = {
  type: 'service_account',
  project_id: 'invoicely-jayshreeram',
  private_key_id: 'a01f581983399a94c617debc2e0d2ae427d76cde',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCozIUEwfqbdSIH\n9m+QiIGY7FGdl5gNeWbjkZ7SCZDbotz2ejWM9D2rtL0FpllUsrvPzlkuyaPjXabv\nalzZ3kASB7gDzaDmt/C9o3O0O8VHvHRAASlNMq+ky3XgkqCeM7welFhVU5xEMKeo\n61o6Wu3X8Rw6fUZGqCBNMNRIdlFlRKhuvXZ6vRvhd/LO/QAT+w1PvXtTsStcng0s\nweA/YVivUeYjsCkU/7AqB1sby+t3TCtdFGCT3gkpZM71wiOCWrRsrfxNLMiFZzI6\nw5sShHhyPqO6b7j3ieB86/uusQgSvTSdLO5HGOzvtbtjk9xAQ4PMAIeg1oD0bXMf\nalwl4mAVAgMBAAECggEAIYTBOj1hq/qBuDaPl1H/+BOfLk3CuBQ+IdzR/o+/N9n6\niigg151NXLoOWd+bOAYo5L4rN+768ARyCHMkvm+TZfEp8Xlk5MOsVp/tMyI2TcUm\niWohny58MdtkDCTZp6iKx8C53LG2Y1UNCe44M8PIHHwImLW1HYU3qtRSJxR1m8fI\ngzGwoRQ86godZaJHVFDghJRySnjtffI0LF0U/pvMnlaMtYpVJibUPGeSqpWP5DXQ\nacYJHAGpRJNjpWHYmD6sR6liRVAyLOhWz2c1EOSjvg7DeV+Rk0/38E37q1woqmWS\n0C4b1mWxcwv+FHPtbEzEu0rH1fpG+lZ3xd5UnD8kQQKBgQDbi4nHTn/wSCRvliM7\npOPEcTUHyoGOEs02Xv7SFGHqGs4vUcH6c7dVT1F6DL8tmJiSsvEb5APSDZ+WRJi7\nQEBMWCzgi97DG2v3o0OAt9EeY7dC1SxAacwvWByO5tBKvZtSvzRq5MOlv+IojSxh\nEahdHtGEzJT/qRP3lHw/1+GOwQKBgQDE09qo0YvNZsKS/6b9sN+RgdOsOc/mBDCH\nW+xAEN5Fa3OtD6soWaY4PNw6MnV6Z/SVaYNSVo7h/Xplg1yaUMNTRBdlJUVlOhc/\nJBefkBSAclyQFve6D+bKZsuAP7IJ93n/JKMiNjHQOT7OLDnV/ba0j5jzDCj5vt8a\nn9qIbXZ6VQJ/VAsWszVZxKHZUN4onqyAhLLRminrbnfEFwxGgCVNVlDsnTCvETE6\n/W1fw1kd1laUEZRuuD6RN9f/P4cC8Kun8ZHPnCXvIMFek23saVn0s614eh0g04es\nonMYe5vgILx0uTh42HK6crkB2oQwePhJe1xQ2IV4hGY1PpGY/telgQKBgAciAk+R\n4HYeHjkDiMKy0TdNtCUOp0kXp8aP/zzHH7b2UOfZpIM+1HY/Rl/ZikZYVBXCEB9A\nwcbQz8mz+/wfpyRyWEKzGhO0CjmgjjabGxMYkeAq5OlaQCvfk8pfBI216Tbk1gCc\nZCu+l1cTZTkrC575gTp1m1qJnz4wwtOk2+FNAoGADzoev0eS1AzDOXuAqRBen/C0\nDnKR7ZatQtv9/OYAl5VLgAxQFhP0/0SB9Ao88xCQ3Pahix1CRg+wQ/7nybWFIriH\nBurHTUiwht39j/NWWajb1OO9kTL068ByyjUNkORst2gqL6rE2DmxCbJjMVwVlqk9\nBvD8hTbJIE4u7fU++HU=\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-fbsvc@invoicely-jayshreeram.iam.gserviceaccount.com',
  client_id: '117776858091182426906',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40invoicely-jayshreeram.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE.APP,
      useValue: firebaseApp,
    },
    {
      provide: FIREBASE.AUTH,
      useValue: firebaseApp.auth(),
    },
  ],
  exports: ['FIREBASE_APP', 'FIREBASE_AUTH'],
})
export class FirebaseModule {}
