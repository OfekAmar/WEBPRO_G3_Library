import { useState } from 'react';

import UserRating from './UserRating';


const CommentSection = ({
  comments = [],
  onPostComment,
  userName = '',
  userRating = 0,
  onRate,
  isLoggedIn = false,
}) => {
  const [rating, setRating] = useState(userRating);


  return (
    <div id="reviews-section" className="mt-12">
      <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>

      {comments.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        comments.map((c, i) => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center gap-2">
                {c.name}
                <div className="flex text-orange-400 text-sm">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={c.rating >= s ? '' : 'text-gray-300'}>★</span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm">{c.text}</p>
          </div>
        ))
      )}

      {isLoggedIn ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const text = form.message.value;

            if (!text) return;

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
          <UserRating
            userRating={rating}
            onRate={(r) => {
              setRating(r);
              onRate?.(r);
            }}
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Write your review..."
            className="border p-2 w-full rounded"
            required
          />
          <button
            type="submit"
            className="border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all"
          >
            Submit Now
          </button>
        </form>
      ) : (
        <p className="text-sm text-red-500 mt-4">Login in order to add a review and rating.</p>
      )}

    </div>
  );
};

export default CommentSection;

