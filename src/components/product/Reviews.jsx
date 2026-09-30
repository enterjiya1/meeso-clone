import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Reviews = ({
  rating = 4.3,
  reviewsCount = 373,
  reviews = []
}) => {
  const [reviewsList, setReviewsList] = useState(reviews);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const { showToast } = useToast();

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      showToast('Please fill out all review fields', 'warning');
      return;
    }

    const created = {
      id: `r_user_${Date.now()}`,
      userName: newReview.name.trim(),
      rating: Number(newReview.rating),
      date: 'Just now',
      verified: true,
      comment: newReview.comment.trim(),
      helpful: 1
    };

    setReviewsList((prev) => [created, ...prev]);
    setShowWriteModal(false);
    setNewReview({ name: '', rating: 5, comment: '' });
    showToast('Your review was posted successfully! ⭐', 'success');
  };

  const handleHelpful = (id) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
    showToast('Thank you for your feedback! 👍', 'info');
  };

  // Star breakdown percentages
  const distribution = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 21 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6">
      {/* Header & Overall Ratings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Ratings & Customer Reviews
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified customer experiences from verified purchases
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowWriteModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-brand-300 text-brand-800 hover:bg-brand-50 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          Write a Review
        </button>
      </div>

      {/* Ratings Overview Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
        <div className="md:col-span-4 text-center md:border-r border-gray-200 md:pr-4">
          <div className="text-4xl font-black text-gray-950 flex items-center justify-center gap-1">
            {Number(rating).toFixed(1)}
            <Star className="w-7 h-7 fill-emerald-600 text-emerald-600" />
          </div>
          <p className="text-xs font-semibold text-emerald-700 mt-1">
            Excellent Overall Rating
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Based on {reviewsCount.toLocaleString()} customer ratings
          </p>
        </div>

        <div className="md:col-span-8 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-2 text-xs">
              <span className="w-7 text-gray-600 font-semibold flex items-center justify-end gap-0.5">
                {d.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-8 text-[11px] text-gray-400 text-right">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {reviewsList.slice(0, 3).map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                  {rev.userName.charAt(0)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{rev.userName}</h5>
                  {rev.verified && (
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] text-gray-400">{rev.date}</span>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rev.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

            <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400">
              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className="hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" /> Helpful ({rev.helpful || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Reviews Button */}
      {reviewsList.length > 0 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="text-xs font-bold text-brand-700 hover:text-brand-900 border border-brand-200 hover:border-brand-600 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1"
          >
            View All {reviewsList.length} Customer Reviews
          </button>
        </div>
      )}

      {/* Modal: View All Reviews */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900">All Customer Reviews</h3>
                <p className="text-xs text-gray-500">Sample verified customer feedback</p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Close reviews modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700">{rev.comment}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAllModal(false)}
                className="w-full py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors"
              >
                Close Reviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write a Review */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowWriteModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Close write review modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-gray-900 mb-1">Write a Customer Review</h3>
            <p className="text-xs text-gray-500 mb-4">Share your feedback on the fabric, fit, and stitching.</p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Shalini Roy"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {newReview.rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="How was the fabric quality, color accuracy, and stitching?"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
