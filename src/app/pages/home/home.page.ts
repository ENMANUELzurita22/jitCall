import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { CallService } from '../../services/call.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface Contact {
  id: string;
  name: string;
  surname: string;
  phone: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contacts: Contact[] = [];
  currentUser: any;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private callService: CallService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadContacts();
    }
  }

  async loadContacts() {
    try {
      const contactsSnapshot = await this.afs
        .collection('users')
        .doc(this.currentUser.uid)
        .collection('contacts')
        .get()
        .toPromise();

      this.contacts = contactsSnapshot?.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  async startCall(contact: Contact) {
    try {
      const callData = await this.callService.startCall(
        contact.id,
        `${contact.name} ${contact.surname}`
      );
      this.router.navigate(['/call', callData.meetingId]);
    } catch (error) {
      this.showError('Error al iniciar llamada', 'No se pudo iniciar la llamada. Intente nuevamente.');
    }
  }

  async addContact() {
    const alert = await this.alertController.create({
      header: 'Agregar Contacto',
      inputs: [
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'Número de teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (data.phone) {
              try {
                const userSnapshot = await this.afs
                  .collection('users')
                  .ref.where('phone', '==', data.phone)
                  .get();

                if (userSnapshot.empty) {
                  this.showError('Error', 'No se encontró ningún usuario con ese número.');
                  return;
                }

                const contact = userSnapshot.docs[0];
                await this.afs
                  .collection('users')
                  .doc(this.currentUser.uid)
                  .collection('contacts')
                  .doc(contact.id)
                  .set(contact.data() as DocumentData);

                this.loadContacts();
              } catch (error) {
                this.showError('Error', 'No se pudo agregar el contacto.');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async showError(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
} 