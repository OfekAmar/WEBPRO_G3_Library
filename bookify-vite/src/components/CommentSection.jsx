import { useState } from 'react';

import UserRating from './UserRating';


const CommentSection = ({ comments = [], onPostComment, userName = '', userRating = 0, onRate }) => {
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
              <div className="font-semibold">{c.name}</div>
              
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
    onRate?.(r); // update DB immediately if desired
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
    </div>
  );
};

export default CommentSection;

