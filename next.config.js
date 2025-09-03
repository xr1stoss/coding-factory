/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.google.com", // ⚠️ add domains you're using
      "images.unsplash.com",
      "picsum.photos",
    ],
  },
};

module.exports = nextConfig;
