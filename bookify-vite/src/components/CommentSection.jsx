import { useState } from 'react';


{/*
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
*/}

const CommentSection = ({ comments = [], onPostComment, userName = '' }) => {
  const [rating, setRating] = useState(0);

  return (
    <div id="reviews-section" className="mt-12">
      <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>

      {comments.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        comments.map((c, i) => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{c.name}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      c.rating >= star ? 'text-orange-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09L5.5 12.09 1 8.27l6.09-.88L10 2l2.91 5.39L19 8.27l-4.5 3.82 1.378 5.999z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-sm">{c.text}</p>
          </div>
        ))
      )}

      {/* טופס ביקורת */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    const form = e.target;
    const text = form.message.value;

    if (!text || rating === 0) return;

    const newComment = {
      name: userName,
      text,
      rating,
    };

    onPostComment?.(newComment);
    form.reset();
    setRating(0);
  }}
  className="mt-8 space-y-4"
>
<h4 className="text-lg font-semibold">{userName}'s Rating</h4>


  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        type="button"
        key={star}
        onClick={() => setRating(star)}
        className={`text-2xl ${
          rating >= star ? 'text-orange-400' : 'text-gray-400'
        }`}
      >
        ★
      </span>
    ))}
  </div>

  <textarea
    name="message"
    rows={4}
    placeholder="Write your review..."
    className="border p-2 w-full rounded"
    required
  />

  <span type="submit" className="border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all">
    Submit Now
  </span>
</form>
    </div>
  );
};

export default CommentSection;