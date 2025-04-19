import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallService } from '../../services/call.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage implements OnInit {
  meetingId: string = '';
  roomUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private callService: CallService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id') || '';
    if (this.meetingId) {
      const callData = await this.callService.answerCall(this.meetingId);
      this.roomUrl = callData.roomUrl;
    }
  }

  async endCall() {
    const alert = await this.alertController.create({
      header: 'Terminar llamada',
      message: '¿Estás seguro de que deseas terminar la llamada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Terminar',
          handler: () => {
            // Aquí se implementaría la lógica para terminar la llamada
            window.location.href = '/home';
          }
        }
      ]
    });

    await alert.present();
  }
} 