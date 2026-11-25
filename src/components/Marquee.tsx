const items = ["Web development", "Technical SEO", "Creative coding", "GitHub workflows", "Interface design", "Product engineering"];

export default function Marquee() {
  return (
    <div className="marquee folio-marquee" aria-label={items.join(", ")}>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map(copy => (
          <div key={copy} className="marquee-group">
            {items.map(item => <span key={item}>{item}<i /></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
