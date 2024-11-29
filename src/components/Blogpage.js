import React from 'react';
import Link from 'next/link';
import AppBar from '@/components/AppBar2';

const BlogPage = () => {
  const blogPosts = [
    
    {
      id: 1,
      title: "Digital Marketing Strategies for Auto Dealers",
      excerpt: "Learn effective digital marketing techniques to increase your dealership's online presence and attract high-intent customers.",
      image: "https://www.pexels.com/photo/man-in-blue-business-suit-talking-to-woman-touching-the-car-7144177/",
      category: "Marketing"
    },
    {
      id: 2,
      title: "Understanding Customer Journey in Auto Sales",
      excerpt: "Discover how the modern car buyer's journey has evolved and how to adapt your sales strategy accordingly.",
      image: "/api/placeholder/400/300",
      category: "Sales"
    },
    {
      id: 3,
      title: "Improving Dealership Operations",
      excerpt: "Expert tips and strategies for streamlining your dealership operations and enhancing customer experience.",
      image: "/api/placeholder/400/300",
      category: "Operations"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        
      {/* Hero Section */}
      <div className="bg-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Auto Industry Insights</h1>
          <p className="text-xl">Stay updated with the latest trends and strategies in automotive retail</p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-red-500 bg-red-100 rounded-full mb-4">
                  {post.category}
                </span>
                <h2 className="text-xl font-bold mb-3 hover:text-red-500 transition-colors duration-300">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.id}`}
                  className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-300"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Get the latest automotive industry insights delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;