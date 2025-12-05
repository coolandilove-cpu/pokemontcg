"use client";

import { motion } from "framer-motion";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TCGBattlePage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="container mx-auto px-4 py-8 bg-white">
        <Header />

        {/* Coming Soon Section */}
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl"
          >
            {/* Icon/Logo */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="mb-8 flex justify-center"
            >
              <img 
                src="/sidebar/battle.png" 
                alt="TCG Battle" 
                className="w-32 h-32 object-contain"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4"
            >
              TCG Battle
            </motion.h1>

            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg rounded-full shadow-lg">
                Coming Soon
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              We're working hard to bring you an amazing battle experience!
              <br />
              Soon you'll be able to battle with your Pokémon cards against trainers from around the world.
            </motion.p>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-2 flex items-center justify-center">
                  <img 
                    src="/sidebar/battle.png" 
                    alt="Battle Mode" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Battle Mode</h3>
                <p className="text-sm text-gray-600">Challenge other trainers</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-2 flex items-center justify-center">
                  <img 
                    src="/sidebar/dashboard.jpg" 
                    alt="Defense" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Defense</h3>
                <p className="text-sm text-gray-600">Protect your cards</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-2 flex items-center justify-center">
                  <img 
                    src="/sidebar/all-cards.jpg" 
                    alt="Power Ups" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Power Ups</h3>
                <p className="text-sm text-gray-600">Boost your attacks</p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

