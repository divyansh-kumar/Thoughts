import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s3.us-east-005.backblazeb2.com"], 
  },
};

module.exports = nextConfig;

