// src/utils/notifications.js

import { get, ref, set } from 'firebase/database';
import { db } from '../firebase';

export const checkDueNotifications = async (user) => {
  if (!user) return;

  const snapshot = await get(ref(db, 'borrows'));
  const allBorrows = Object.values(snapshot.val() || {});

  const todayStr = new Date().toISOString().split('T')[0];

  for (const borrow of allBorrows) {
    if (
      borrow.user_id === user.user_id &&
      borrow.status === 'borrow' &&
      borrow.ret_date === todayStr
    ) {
      const notifSnap = await get(ref(db, 'managment/noti_index'));
      const notiId = notifSnap.val() + 1;

      await set(ref(db, `notifications/${notiId}`), {
        noti_id: notiId,
        user_id: user.user_id,
        user_index: user.userIndex,
        type: "Reminder",
        content: ` Reminder: Today is the return day for book ID ${borrow.book_id}.`,
        time: new Date().toISOString()
      });

      await set(ref(db, 'managment/noti_index'), notiId);
    }
  }
};
