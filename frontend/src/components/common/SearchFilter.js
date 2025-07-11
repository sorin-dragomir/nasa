import React, { useState } from "react";
import Button from "./Button";
import { useSound } from "../../contexts/SoundContext";
import "./SearchFilter.css";

const SearchFilter = ({ onSearch, onFilterChange, filters = {}, loading = false, placeholder = "Search...", searchTypes = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localFilters, setLocalFilters] = useState(filters);
  const { playSound } = useSound();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery, localFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocalFilters({});
    onSearch("", {});
  };

  return (
    <div className="search-filter">
      <div className="card bg-dark border-secondary">
        <div className="card-body">
          <form onSubmit={handleSearch} className="search-form">
            <div className="row">
              <div className="col-lg-8 col-md-12 mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-secondary border-secondary">
                    <i className="material-icons text-light">search</i>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => playSound("click")}
                    placeholder={placeholder}
                    className="form-control bg-dark text-light border-secondary"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={(e) => {
                        playSound("click");
                        setSearchQuery("");
                      }}
                    >
                      <i className="material-icons">close</i>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <Button type="submit" disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <i className="material-icons spinning me-2">refresh</i>
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>

            {searchTypes.length > 0 && (
              <div className="row mb-3">
                <div className="col-12">
                  <div className="btn-group" role="group" aria-label="Search type selection">
                    {searchTypes.map((type) => (
                      <React.Fragment key={type.value}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="searchType"
                          id={`searchType-${type.value}`}
                          value={type.value}
                          checked={localFilters.type === type.value}
                          onChange={(e) => handleFilterChange("type", e.target.value)}
                          autoComplete="off"
                        />
                        <label className="btn btn-outline-primary" htmlFor={`searchType-${type.value}`}>
                          {type.label}
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>

          {searchQuery && (
            <div className="filter-controls mt-2">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    playSound("click");
                    clearFilters();
                  }}
                >
                  <i className="material-icons me-2">clear</i>
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
