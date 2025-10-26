type HowToPlayProps = {
  className?: string
}

/**
 * HowToPlay
 * A simple, accessible help component explaining how to use the application.
 * Place this file at: /src/components/page/howToPlay.tsx
 */
const HowToPlay: React.FC<HowToPlayProps> = ({ className }) => {
  return (
    <section
      className={`mx-auto max-w-3xl px-4 ${className ?? ''}`}
      aria-labelledby="how-to-play"
      id="how-to-play"
      role="region"
    >
      <h1 className="mt-8 mb-6 text-xl sm:text-2xl font-bold">
        How to play 🚀🎮
      </h1>

      <p>
        Welcome to the story adventure! 🌟 Follow these simple steps to get
        started and have fun creating your own tale.
      </p>

      <ul className="mt-4 space-y-6 list-none list-inside text-sm sm:text-base leading-relaxed marker:font-semibold marker:text-indigo-600 dark:marker:text-indigo-400">
        <li>
          <strong>Connect 🔌</strong>
          <p>
            Tap the "Connect" button to link up with the server. Wait until the
            status shows "Idle" ✅ before you begin.
          </p>
        </li>
        <li>
          <strong>Record 🎙️</strong>
          <p>
            When you're ready, press "Record". The status will change to
            "Recording" 🎤 — then speak your story idea! For example: "Tell me a
            story about a brave dog in a spaceship." 🐶🚀
          </p>
        </li>

        <li>
          <strong>Allow permissions 🎧</strong>
          <p>
            The browser may ask for microphone access. Please allow it so the
            app can hear you — you won't be able to record without permission.
          </p>
        </li>

        <li>
          <strong>Continue the adventure ▶️</strong>
          <p>
            After you speak, the app will respond with audio and continue the
            story. Keep recording more prompts to guide the next parts of the
            tale — the story grows as you play! ✨
          </p>
        </li>

        <li>
          <strong>Finish 🛑</strong>
          <p>
            To end the session, say "Stop" or press the stop control. You can
            reconnect anytime to start a brand new adventure. 🎉
          </p>
        </li>
        <li>
          <strong>Tip 💡</strong>
          <p>Speak clearly and have fun — your imagination is the hero! 💫</p>
        </li>
      </ul>
    </section>
  )
}

export default HowToPlay
