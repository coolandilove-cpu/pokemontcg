"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import styles from "./styles.module.css";

interface ICardProps {
  src: string;
  onClick?: () => void;
  hasGrayScale?: boolean;
  boosters?: string[];
  name?: string;
  rarity?: string;
  type?: string;
}

const Card = (props: ICardProps) => {
  const { src, onClick, hasGrayScale, boosters, name, rarity, type } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // No longer calling onClick - cards in album are view-only
  };

  // Close modal on ESC key
  useEffect(() => {
    if (!isModalOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <>
      <div 
        className={`${styles.card} relative ${!hasGrayScale ? 'ring-2 ring-yellow-400 ring-opacity-75 shadow-lg shadow-yellow-400/50' : ''}`}
        onClick={handleCardClick}
      >
        <img
          className={styles.card}
          style={{
            filter: hasGrayScale ? "grayscale(100%)" : "none",
          }}
          src={src}
          alt="Pokemon"
        />

        {/* Collected Badge */}
        {!hasGrayScale && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
            <span className="text-[10px]">✓</span>
            <span>Collected</span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 flex gap-1 md:bottom-4 md:right-4">
          {boosters?.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="booster pack"
              title="Booster Pack que contém este Pokémon"
              style={{ filter: "none", width: 50, height: 90 }}
            />
          ))}
        </div>
      </div>

      {/* Modal for enlarged card */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Content - no backdrop */}
            <motion.div
              className="relative max-w-md w-full mx-auto pointer-events-auto"
              style={{ zIndex: 10000 }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors z-20 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Card Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={src}
                  alt={name || "Pokemon"}
                  className="w-full h-auto object-contain"
                  style={{
                    filter: hasGrayScale ? "grayscale(100%)" : "none",
                    imageRendering: "crisp-edges",
                    WebkitImageRendering: "crisp-edges" as any,
                    maxHeight: "80vh",
                  }}
                  loading="eager"
                />

                {/* Card Info Overlay */}
                {(name || rarity || type) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 md:p-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    {name && (
                      <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
                        {name}
                      </h3>
                    )}
                    <div className="flex items-center gap-4 flex-wrap">
                      {rarity && (
                        <p className={`text-base md:text-lg font-semibold ${
                          rarity.includes("◊◊◊◊") ? "text-purple-300" :
                          rarity.includes("◊◊◊") ? "text-blue-300" :
                          rarity.includes("◊◊") ? "text-green-300" :
                          "text-gray-300"
                        }`}>
                          {rarity}
                        </p>
                      )}
                      {type && (
                        <p className="text-white/70 text-sm md:text-base">
                          Type: <span className="capitalize">{type}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;
