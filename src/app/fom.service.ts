import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FomService {
   Router = inject(Router)


  constructor(private router: Router) {}

  initPush() {
    if (Capacitor.isNativePlatform()) {
      this.registerPush();
    }
  }

  private async registerPush() {
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      await PushNotifications.register();

      // Listener: token de registro
      PushNotifications.addListener('registration', async token => {
        console.log("token", token);
      });

      // Listener: error en el registro
      PushNotifications.addListener('registrationError', (error: any) => {
        console.log("Error", JSON.stringify(error));
      });

      // Listener: acción realizada sobre una notificación
      PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
        console.log("notification", notification);

        const data = notification.notification;
        console.log("data token data", data.data);

        this.router.navigateByUrl("/redirect-notification");
      });

    } else {
      console.log('Permiso denegado para notificaciones');
    }
  }
}



