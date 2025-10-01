import { useEffect, useRef } from "react";

export default function ExamAudioAlert({ timeLeft, duration }) {
  const audioRef = useRef(null);
  const halfPlayed = useRef(false);
  const lastMinutePlayed = useRef(false);

  useEffect(() => {
    if (!duration || !timeLeft) return;

    const halfTime = duration / 2;

    // 🔔 Play once when exam time reaches 50%
    if (timeLeft <= halfTime && !halfPlayed.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play blocked by browser:", err);
      });
      halfPlayed.current = true;
    }

    // 🔔 Play once again when only 1 minute left
    if (timeLeft <= 60 && !lastMinutePlayed.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play blocked by browser:", err);
      });
      lastMinutePlayed.current = true;
    }
  }, [timeLeft, duration]);

  return (
    <audio
      ref={audioRef}
      src="/beep-warning-6387.mp3"
      preload="auto"
    />
  );
}
