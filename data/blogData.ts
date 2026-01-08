// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: number; // in minutes
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Sustainable Development: Technology's Role in Building a Better Tomorrow",
    excerpt: "Exploring how cutting-edge technology is revolutionizing sustainable development practices and creating innovative solutions for global challenges.",
    content: "Technology has become the cornerstone of modern sustainable development initiatives...",
    author: "Dr. Sarah Johnson",
    publishedAt: "2024-12-15",
    category: "Technology",
    tags: ["sustainability", "innovation", "technology", "environment"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    readTime: 8,
    featured: true
  },
  {
    id: "2",
    title: "Community-Driven Innovation: Success Stories from Local Changemakers",
    excerpt: "Discover inspiring stories of community leaders who are driving positive change through grassroots innovation and collaborative problem-solving.",
    content: "Local communities around the world are becoming powerful engines of innovation...",
    author: "Michael Chen",
    publishedAt: "2024-12-10",
    category: "Community",
    tags: ["community", "innovation", "leadership", "social impact"],
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    readTime: 6,
    featured: true
  },
  {
    id: "3",
    title: "Digital Transformation in Education: Bridging the Gap for Underserved Communities",
    excerpt: "How digital technologies are making quality education more accessible and creating new opportunities for learners worldwide.",
    content: "The digital revolution has opened unprecedented opportunities in education...",
    author: "Prof. Emma Williams",
    publishedAt: "2024-12-05",
    category: "Education",
    tags: ["education", "digital transformation", "accessibility", "technology"],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    readTime: 7,
    featured: false
  },
  {
    id: "4",
    title: "Healthcare Innovation: Leveraging AI for Better Patient Outcomes",
    excerpt: "Examining how artificial intelligence is transforming healthcare delivery and improving patient care in both urban and rural settings.",
    content: "Artificial intelligence is reshaping the healthcare landscape...",
    author: "Dr. James Rodriguez",
    publishedAt: "2024-11-28",
    category: "Healthcare",
    tags: ["healthcare", "AI", "patient care", "medical technology"],
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
    readTime: 9,
    featured: false
  },
  {
    id: "5",
    title: "Green Energy Solutions: Innovations Powering Sustainable Communities",
    excerpt: "A comprehensive look at renewable energy innovations that are making sustainable living more accessible and affordable.",
    content: "The transition to renewable energy sources is accelerating globally...",
    author: "Lisa Park",
    publishedAt: "2024-11-20",
    category: "Environment",
    tags: ["renewable energy", "sustainability", "green technology", "climate"],
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
    readTime: 10,
    featured: false
  },
  {
    id: "6",
    title: "Youth Entrepreneurship: Empowering the Next Generation of Innovators",
    excerpt: "Supporting young entrepreneurs and their innovative solutions to create positive social and economic impact.",
    content: "Young entrepreneurs are driving innovation across all sectors...",
    author: "Alex Thompson",
    publishedAt: "2024-11-15",
    category: "Entrepreneurship",
    tags: ["youth", "entrepreneurship", "innovation", "business"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    readTime: 5,
    featured: false
  }
];

export const blogCategories = [
  "All",
  "Technology",
  "Community",
  "Education",
  "Healthcare",
  "Environment",
  "Entrepreneurship"
];

// Get featured blog posts
export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

// Get posts by category
export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === "All") return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

// Get post by ID
export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

// Get recent posts
export const getRecentPosts = (limit: number = 3): BlogPost[] => {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};
