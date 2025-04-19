import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private token: string = '';

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  async initPushNotifications() {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== 'granted') {
          throw new Error('User denied permissions!');
        }
      }

      await PushNotifications.register();
      
      PushNotifications.addListener('registration', (token) => {
        this.token = token.value;
        this.saveToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async saveToken(token: string) {
    const uid = localStorage.getItem('uid');
    if (uid) {
      const user = await this.afs.collection('users').doc(uid).get().toPromise();
      if (user) {
        await this.afs.collection('users').doc(uid).update({
          token: token
        });
      }
    }
  }

  async sendNotification(toToken: string, title: string, body: string, data: any) {
    try {
      const response = await this.http.post(`${environment.apiUrl}/notifications`, {
        token: toToken,
        notification: {
          title: title,
          body: body
        },
        android: {
          priority: "high",
          data: data
        }
      }).toPromise();
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
} 