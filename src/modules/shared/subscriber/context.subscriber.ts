import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from 'typeorm';
import { GlobalService } from '../global.service';
import e from 'express';

@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    if (event.entity != undefined) {
      event.entity.creationUser = GlobalService.userSession;
      event.entity.updateUser = GlobalService.userSession;
    }
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    if (event.entity != undefined) {
      event.entity.updateUser = GlobalService.userSession;
    }
  }

  /**
   * Called before entity removal.
   */
  beforeRemove(event: RemoveEvent<any>) {
    if (event.entity != undefined) {
      event.entity.updateUser = GlobalService.userSession;
    }
  }
}
