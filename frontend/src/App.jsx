import { useEffect, useState } from "react";
import { ensureSignedIn } from "./firebase.js";
import { runAgent } from "./api.js";
import PromptInput from "./components/PromptInput.jsx";
import StepsPanel from "./components/StepsPanel.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    ensureSignedIn(() => setReady(true));
  }, []);

  function handleSubmit(prompt) {
    setIsRunning(true);
    setSteps([]);
    setResult(null);
    setError(null);

    runAgent(prompt, {
      onStep: (step) => setSteps((prev) => [...prev, step]),
      onDone: (data) => {
        setResult(data);
        setIsRunning(false);
      },
      onError: (err) => {
        setError(err.message);
        setIsRunning(false);
      },
    });
  }

  function handleReset() {
    setSteps([]);
    setResult(null);
    setError(null);
  }

  return (
    <div className="app-shell">
      <header>
        <h1 className="wordmark">
          Gift<span>Graph</span>
        </h1>
        <p className="tagline">Tell it about someone. It searches, checks the budget, and writes the note.</p>
      </header>

      <PromptInput onSubmit={handleSubmit} disabled={!ready || isRunning} />

      <StepsPanel steps={steps} isRunning={isRunning} />

      {error && <p className="error-text">Something went wrong: {error}</p>}

      <ResultCard result={result} onReset={handleReset} />
    </div>
  );
}
