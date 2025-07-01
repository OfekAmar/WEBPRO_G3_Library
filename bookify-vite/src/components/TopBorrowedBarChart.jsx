import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const TopBorrowedBarChart = ({ borrows, books, startDate, endDate }) => {
  // Check if borrow date is within the selected date range
  const isInRange = (date) => !startDate || !endDate || (new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate));
  // Count borrows per book within date range
  const counts = {};
  borrows.forEach(b => isInRange(b.b_date) && (counts[b.book_id] = (counts[b.book_id] || 0) + 1));
  // Prepare top 6 most borrowed books data for chart display
  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({ name: books.find(b => b.book_id == id)?.name || `Book ${id}`, count }));

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-2">Most Borrowed Books (Top 6)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
            dataKey="name"
            interval={0}
            tick={({ x, y, payload }) => {
                const words = payload.value.split(' ');
                const lines = [];
                let line = '';

                words.forEach((word) => {
                if ((line + ' ' + word).length > 15) {
                    lines.push(line);
                    line = word;
                } else {
                    line += (line ? ' ' : '') + word;
                }
                });
                if (line) lines.push(line);

                const visibleLines = lines.slice(0, 3);
                if (lines.length > 3) visibleLines[2] += '...';

                return (
                <g transform={`translate(${x},${y + 10})`}>
                    {visibleLines.map((line, i) => (
                    <text
                        key={i}
                        x={0}
                        y={i * 12}
                        textAnchor="middle"
                        fill="#666"
                        fontSize="12"
                    >
                        {line}
                    </text>
                    ))}
                </g>
                );
            }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0d9488" />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default TopBorrowedBarChart;
