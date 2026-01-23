/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./loader";

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-12 w-[90%] max-w-md text-center border border-black/5"
            >
              <div className="flex justify-center mb-8">
                <Loader />
              </div>

              <h2 className="text-2xl font-black text-black tracking-tight mb-2">
                جاري الرفع...
              </h2>

              <p className="text-black/30 font-bold text-sm uppercase tracking-widest">
                يرجى عدم إغلاق هذه الصفحة
              </p>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
