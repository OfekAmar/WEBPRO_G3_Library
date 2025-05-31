import { get, set, update, ref } from 'firebase/database';
import { db } from '../firebase';

export const checkDueNotifications = async (user) => {
  const today = new Date().toISOString().split('T')[0];
  const borrowsSnap = await get(ref(db, 'borrows'));
  const borrows = borrowsSnap.val() || [];
  const notifSnap = await get(ref(db, 'managment/noti_index'));
  let notiId = notifSnap.val() + 1;
  const booksSnap = await get(ref(db, 'books'));
  const books = booksSnap.val();

  const dueBorrows = Object.values(borrows).filter(
    b => b.user_id === user.user_id &&
         b.ret_date === today &&
         b.status === "borrow"
  );

  for (const b of dueBorrows) {
    const bookName = books[b.book_id]?.name || "a book";
    await set(ref(db, `notifications/${notiId}`), {
      noti_id: notiId,
      user_index: user.userIndex,
      user_id: user.user_id,
      type: "Reminder",
      content: `Reminder: '${bookName}' is due today.`,
      time: new Date().toISOString()
    });
    notiId++;
  }

  await update(ref(db, 'managment'), { noti_index: notiId - 1 });
};