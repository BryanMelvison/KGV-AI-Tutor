import { useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const UnlockBox = () => {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const params = useParams();
  const correctPassword = "open-sesame";

  const handleUnlock = () => {
    if (input.trim() === correctPassword) {
      setUnlocked(true);
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
      setShowPopup(true);
      setError("");
      setTimeout(() => setShowPopup(false), 2000);
    } else {
      setError("Wrong password!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGoToFinalExercise = () => {
    if (
      typeof params.subject === "string" &&
      typeof params.chapter === "string"
    ) {
      router.push(
        `/subjects/${params.subject}/${params.chapter}?exercise=final`
      );
    }
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: unlocked ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      className={`relative p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center h-full border-2
        ${
          unlocked
            ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400"
            : "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
        }
      `}
    >
      {/* Sparkle Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-5 bg-white border border-yellow-300 rounded-md px-3 py-1 shadow text-yellow-700 text-sm"
          >
            ✨ Treasure Unlocked! ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chest Image */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Image
          src={unlocked ? "/opened.png" : "/closed.png"}
          alt="Treasure Chest"
          width={120}
          height={120}
        />
      </motion.div>

      <h3 className="text-xl font-semibold text-yellow-700 mt-2">
        {unlocked ? "Treasure Unlocked!" : "Unlock the Treasure"}
      </h3>

      <p className="text-sm text-yellow-600 text-center mb-2">
        {unlocked
          ? "You got the hidden reward 🗝️✨"
          : "Enter the secret password from your exercises"}
      </p>

      {!unlocked ? (
        <>
          <input
            type="text"
            placeholder="🔑 Enter password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`p-2 border rounded-full w-full mb-2 text-[#747479] text-center text-sm bg-yellow-50 focus:outline-none focus:ring-2 ${
              error
                ? "border-red-400 focus:ring-red-300"
                : "focus:ring-yellow-400"
            } ${shake ? "animate-shake" : ""}`}
          />

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button
            onClick={handleUnlock}
            className="bg-yellow-400 text-white text-sm px-4 py-2 rounded-full hover:bg-yellow-500 transition shadow"
          >
            Unlock ✨
          </button>
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoToFinalExercise}
          className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full mt-2 hover:bg-yellow-600 transition shadow"
        >
          Go to Final Exercise 🚪
        </motion.button>
      )}
    </motion.div>
  );
};

export default UnlockBox;
