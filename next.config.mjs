/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s38xtrgrkkylnxcu.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
