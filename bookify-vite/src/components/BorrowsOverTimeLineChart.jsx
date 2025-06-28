import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const BorrowsOverTimeLineChart = ({ borrows, startDate, endDate }) => {
  const isInRange = (date) => !startDate || !endDate || (new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate));
  const perDay = {};
  borrows.forEach(b => isInRange(b.b_date) && (perDay[b.b_date] = (perDay[b.b_date] || 0) + 1));
  const data = Object.entries(perDay).sort().map(([date, count]) => ({ date, count }));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Total Borrows Per Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowsOverTimeLineChart;
