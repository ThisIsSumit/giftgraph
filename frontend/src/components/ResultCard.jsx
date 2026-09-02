export default function ResultCard({ result, onReset }) {
  if (!result) return null;
  const { product, message } = result;

  return (
    <div className="result-card">
      <p className="result-eyebrow">Found it</p>
      <h2 className="result-name">{product.name}</h2>
      <p className="result-price">${product.price}</p>
      <p className="result-description">{product.description}</p>
      <div className="result-note">
        <p>{message}</p>
      </div>
      <button className="result-reset" onClick={onReset}>
        Find another gift
      </button>
    </div>
  );
}
