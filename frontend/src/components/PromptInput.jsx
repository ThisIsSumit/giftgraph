import { useState } from "react";

export default function PromptInput({ onSubmit, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="prompt-form">
      <textarea
        className="prompt-input"
        placeholder="Something for my sister who's into hiking, budget around $40"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        disabled={disabled}
      />
      <button type="submit" className="prompt-submit" disabled={disabled || !value.trim()}>
        {disabled ? "Finding a gift…" : "Find a gift"}
      </button>
    </form>
  );
}
