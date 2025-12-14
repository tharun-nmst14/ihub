export default function ListingCard({ item }) {
  const img =
    item.images?.[0] ||
    `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/400`;

  return (
    <div className="card fade-in">
      <div className="card-image h-44">
        <img src={img} alt={item.title} />
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <span className="badge">₹{item.price}</span>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {item.description || 'Well maintained item, ready to use.'}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {item.category} • {item.seller?.department || 'Campus'}
          </span>
          <a href={`mailto:${item.seller?.email}`} className="btn-primary text-sm">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
