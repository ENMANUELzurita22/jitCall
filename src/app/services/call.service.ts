import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationService } from './notification.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';

interface UserData {
  token?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(
    private afs: AngularFirestore,
    private notificationService: NotificationService
  ) {}

  async startCall(contactId: string, contactName: string) {
    try {
      const meetingId = uuidv4();
      const contact = await this.afs.collection('users').doc(contactId).get().toPromise();
      const contactData = contact?.data() as UserData;
      
      if (contact && contactData?.token) {
        await this.notificationService.sendNotification(
          contactData.token,
          'Llamada entrante',
          `${contactName} te está llamando`,
          {
            userId: contactId,
            meetingId: meetingId,
            type: 'incoming_call',
            name: contactName,
            userFrom: localStorage.getItem('uid')
          }
        );

        return {
          meetingId: meetingId,
          roomUrl: `${environment.jitsiServer}/${meetingId}`
        };
      } else {
        throw new Error('Contact not found or has no token');
      }
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async answerCall(meetingId: string) {
    return {
      meetingId: meetingId,
      roomUrl: `${environment.jitsiServer}/${meetingId}`
    };
  }
} 