const SearchFilters = ({ search, setSearch, selectedTypes, setSelectedTypes }) => {
  const types = ['remote', 'onsite', 'hybrid'];

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="search-filters">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, company or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="searchInput"
        />
      </div>
      <div className="filter-chips">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`chip ${selectedTypes.includes(type) ? 'chip-active' : ''}`}
            id={`filter-${type}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
