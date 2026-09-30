import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { CredentialsService } from 'src/app/services/credentials.service';
import { AlertService } from 'src/app/shared/commons/alert.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { WebSocketService } from 'src/app/shared/services/notification/web-socket.service';

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent {
  // notifications = [
  //   { id: 1, title: 'Notification 1', details: 'Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu\'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem', date: '03/03/2023', isRead: false },
  //   { id: 2, title: 'Notification 2', details: 'Détails de la notification 2', date: '03/03/2023', isRead: true },
  // ];
  private readonly subscriptions = new Subscription();
  notifications: any[] = [];
  selectedNotification: any = null;
  idUser: any;
  page = 1;
  size = 6;
  userInfos: any;
  profileId: any;
  profilConnecte: any;
  collectionSize1 = 0;
  notReads = 0;
  constructor(
    private readonly notificationService: NotificationService,
    private credentialsService: CredentialsService,
    private readonly webSocketService : WebSocketService,
   // private alertService: AlertService,
  ) {
    this.userInfos = this.credentialsService.getUserInfos();
    this.profilConnecte = this.userInfos.profil;
    this.profileId = this.profilConnecte[0].id;
    this.idUser = this.userInfos.id;
  }

  ngOnInit(): void {
    this.getAllNotification();
    this.subscriptions.add(this.webSocketService.connect().subscribe(() => this.getAllNotification()));
  }

  selectNotification(notification: any) {
    // Si la notification sélectionnée est déjà sélectionnée, on la désélectionne
    if (this.selectedNotification === notification) {
      this.selectedNotification = null; // Désélectionner la notification
    } else {
      this.selectedNotification = notification; // Sélectionner la nouvelle notification
       if (!notification.read)
         this.notificationService
           .readNotify(notification.id)
           .subscribe((data: any) => {
             if (data.status?.includes('OK')) {
               notification.read = true;
               this.getAllNotification();
             }
           });
    }
  }

  getAllNotification() {
    this.notificationService.getListNotifications(this.idUser, this.profilConnecte[0]?.code ?? '')
      .subscribe({
        next: (data: ResponseApi2) => {
          if (data.status?.includes('OK')) {
            this.notifications = data.payload ?? [];
            this.collectionSize1 = this.notifications.length;
            this.notReads = this.notifications[0]?.notReads ?? 0;
            this.notificationService.updateNbre(this.notReads);
            if (this.selectedNotification) {
              this.selectedNotification = this.notifications.find(n => n.id === this.selectedNotification.id) ?? null;
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
