import { useState } from 'react';
import Button from './Button';

const CommentSection = ({ comments = [], onPostComment, userName }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onPostComment?.({ name: userName, text: text.trim() });
    setText('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <ul className="space-y-3 mb-6">
        {comments.length === 0 && (
          <li className="text-gray-500">No comments yet.</li>
        )}
        {comments.map((c, idx) => (
          <li key={idx} className="bg-gray-100 p-3 rounded">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-gray-700">{c.text}</p>
          </li>
        ))}
      </ul>

      {userName ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="p-2 border border-gray-300 rounded resize-none"
            rows={3}
          />
          <Button label="Post Comment" variant="primary" />
        </form>
      ) : (
        <p className="text-sm text-gray-500">Login to post a comment.</p>
      )}
    </div>
  );
};

export default CommentSection;
