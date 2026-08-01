/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} organization
 * @property {"Client"|"Colleague"|"Manager"|"Mentor"|"Student"} category
 * @property {string} image
 * @property {string} country
 * @property {number} rating
 * @property {string} testimonial
 * @property {string=} linkedin
 * @property {boolean=} featured
 */

/**
 * Add verified recommendations here as they become available. Keeping this
 * separate from the UI makes a future CMS or API migration straightforward.
 *
 * @type {Testimonial[]}
 */
const TESTIMONIALS = [
    {
        id: "t1",
        name: "Nischal Shakya",
        role: "Senior Engineer",
        organization: "Leapfrog Technology",
        category: "Colleague - Herald College Kathmandu",
        image: "public/images/testimonials/nischal-shakya.jpg",
        country: "NP",
        linkedin: "https://www.linkedin.com/in/nischal-shakya-602239126/",
        testimonial: "During our time teaching together at Herald College, Sajag was always dedicated to helping students understand programming concepts, especially Object-Oriented Programming. He prepared well, explained ideas in a simple way, and was approachable whenever students needed support. It was a pleasure working alongside him.",
        featured: false
    },
    {
        id: "t2",
        name: "Shiva Ram Silwal",
        role: "Chairman",
        organization: "Basuki Transport Pvt. Ltd.",
        category: "Employer",
        image: "public/images/testimonials/shiva-ram-silwal.jpg",
        country: "NP",
        companyWebsite: "https://basukitransport.com",
        testimonial: "Sajag played an important role in helping us modernize our transport operations. He understands both technology and business, which made it easier to build solutions that fit our day-to-day needs. He is responsible, listens carefully, and always looks for practical ways to solve problems. I appreciate his commitment to improving our organization through technology.",
        featured: true
    },
    {
        id: "t3",
        name: "Image Adhikari",
        role: "PhD Student",
        organization: "Rochester Institute of Technology(RIT)",
        category: "Collegue, Classmate",
        image: "public/images/testimonials/satish-khatri.jpg",
        country: "NP",
        linkedin: "https://www.linkedin.com/in/image-adhikari/",
        companyWebsite: "https://imageadhikari.com.np/",
        testimonial: "Studying with Sajag during our undergrad and workingh alongside him both during those years and beyond, I can confidently say he is one of the most dedicated people I know when it comes to anything he chooses to pursue. He consistently demonstrated a strong grasp of engineering concepts and problem-solving skills whenever we worked together. Beyond his technical expertise, he is a capable leader who communicates clearly, making collaboration effortless. I highly recommend him to anyone looking for a skilled, dependable, and enthusiastic engineer who consistently delivers high-quality results.",
        featured: false
    },
    {
        id: "t4",
        name: "Satish Khatri",
        role: "Managing Director",
        organization: "Aashirbad Group",
        category: "Client",
        image: "public/images/testimonials/satish-khatri.jpg",
        country: "NP",
        linkedin: "https://www.linkedin.com/in/satish-khatri-5225591a1/",
        testimonial: "Working with Sajag has been a positive experience. He approaches every project with professionalism and a willingness to learn. What stands out is his ability to understand requirements clearly and turn ideas into practical software solutions.",
        featured: false
    },
    {
        id: "t5",
        name: "Sambeg Shrestha",
        role: "Senior Engineer",
        organization: "KonnectCraft",
        category: "Colleague",
        image: "public/images/testimonials/sambeg-shrestha.jpg",
        country: "NP",
        linkedin: "https://www.linkedin.com/in/sthasam/",
        testimonial: "Having worked alongside Sajag both as a classmate and a professional colleague, I've seen firsthand his strong technical skills and problem-solving abilities. He is a reliable team player who consistently delivers high-quality work on complex projects. His transition from academic excellence to professional engineering has been impressive.",
    },
    {
        id: "t6",
        name: "Sajan Bhandari",
        role: "Multiple District President",
        organization: "Leo Multiple Council 325B1",
        category: "Client",
        image: "public/images/testimonials/sajan-bhandari.jpg",
        country: "NP",
        linkedin: "https://www.linkedin.com/in/sajan-bhandari-120065248/",
        testimonial: "Sajag's contribution to the Leo Multiple District 325 Nepal digital platform went beyond building software. He understood the needs of our volunteers and leaders, creating a system that makes community service easier to organize and manage across the country. His dedication to service made him a valuable part of this initiative.",
    },

    /*{
        id: "t5",
        name: "Pravash Karki",
        role: "CEO & Founder",
        organization: "Lastdoor Solutions",
        category: "Mentor",
        image: "",
        country: "NP",
        testimonial: "I've had the opportunity to discuss product ideas and emerging market opportunities with Sajag. What stands out is his ability to think beyond implementation and focus on solving real-world problems. He brings thoughtful perspectives to product strategy and is always eager to explore innovative ideas that create meaningful value.",
        featured: true
    }*/
];

window.TESTIMONIALS = TESTIMONIALS;
