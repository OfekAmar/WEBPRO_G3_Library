import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import UnavailableBooksSection from '../components/UnavailableBooksSection';
import TopBorrowedBarChart from '../components/TopBorrowedBarChart';
import BorrowsOverTimeLineChart from '../components/BorrowsOverTimeLineChart';
import Field from '../components/Field';

const StatisticsPage = () => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch books and borrows data from Firebase
    const fetchData = async () => {
      const booksSnap = await get(ref(db, 'books'));
      const borrowsSnap = await get(ref(db, 'borrows'));
      setBooks(Object.values(booksSnap.val() || {}));
      setBorrows(Object.values(borrowsSnap.val() || {}));
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 text-copy-primary max-w-5xl mx-auto">
      <h2 className="text-6xl font-bold mb-6"> Statistics</h2>

      <UnavailableBooksSection books={books} />

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <Field label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Field label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <TopBorrowedBarChart borrows={borrows} books={books} startDate={startDate} endDate={endDate} />
        <BorrowsOverTimeLineChart borrows={borrows} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default StatisticsPage;
