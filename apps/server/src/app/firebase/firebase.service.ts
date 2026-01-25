import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  public readonly firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        private_key_id: this.configService.get<string>(
          'FIREBASE_PRIVATE_KEY_ID'
        ),
        private_key: privateKey,
        client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>(
          'FIREBASE_AUTH_PROVIDER_X509_CERT_URL'
        ),
        client_x509_cert_url: this.configService.get<string>(
          'FIREBASE_CLIENT_X509_CERT_URL'
        ),
        universe_domain: 'googleapis.com',
      } as admin.ServiceAccount),
    });
  }
}
