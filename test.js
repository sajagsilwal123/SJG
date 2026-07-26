const testimonials = [1, 2, 3, 4, 5];
const visibleCount = 3;
const leading = testimonials.slice(-visibleCount);
const trailing = testimonials.slice(0, visibleCount);
console.log("Leading:", leading);
console.log("Trailing:", trailing);
