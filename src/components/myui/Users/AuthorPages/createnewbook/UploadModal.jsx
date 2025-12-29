/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import  loader  from "./loader";

export default function UploadModal({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="bg-white rounded-2xl shadow-lg p-10 w-[90%] max-w-md text-center"
          >
            <div className="flex justify-center mb-6">
              <loader />
            </div>

            <h2 className="text-xl font-bold text-[var(--earth-brown-dark)] mb-3">
              جاري الرفع...
            </h2>

            <p className="text-[var(--earth-brown)]/80 text-lg">
              يرجى عدم إغلاق هذه الصفحة
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
