import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationToken } from 'src/entities/notification-token.entity';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
  ) {}

  acceptPushNotification = async (
    user: any,
    notification_dto: NotificationDto,
  ): Promise<NotificationToken> => {
    await this.notificationTokenRepo.update(
      { user: { id: user.id } },
      {
        status: 'INACTIVE',
      },
    );
    // save to db
    const notification_token = await this.notificationTokenRepo.save({
      user: user,
      device_type: notification_dto.device_type,
      notification_token: notification_dto.notification_token,
      status: 'ACTIVE',
    });
    return notification_token;
  };

  disablePushNotification = async (
    user: any,
    update_dto: UpdateNotificationDto,
  ): Promise<void> => {};

  getNotifications = async (): Promise<any> => {};

  sendPush = async (
    user: any,
    title: string,
    body: string,
  ): Promise<void> => {};
}
