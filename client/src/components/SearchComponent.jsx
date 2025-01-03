import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import { FaTimes } from "react-icons/fa";
import { getAlbumsByArtist } from "../api";

const SearchComponent = ({ type, data, artistId, setArtist }) => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [{}, dispatch] = useStateValue();

  // useEffect(() => {
  //   if (searchInput.trim() !== "") {
  //     const filteredResults = data.filter((item) => {
  //       const searchValue = searchInput.toLowerCase();
  //       return (
  //         item.name?.toLowerCase().includes(searchValue) ||
  //         item.title?.toLowerCase().includes(searchValue) ||
  //         item.artist?.toLowerCase().includes(searchValue) ||
  //         item.album?.toLowerCase().includes(searchValue)
  //       );
  //     });
  //     setResults(filteredResults);
  //     setIsDropdownVisible(true);
  //   } else {
  //     setResults([]);
  //     setIsDropdownVisible(false);
  //   }
  // }, [searchInput, type, data]);

  useEffect(() => {
    if (searchInput.trim() !== "") {
      if (type === "albums" && artistId) {
        // Gọi API để lấy danh sách album của artist
        getAlbumsByArtist(artistId)
          .then((albums) => {
            const filteredResults = albums.filter((item) =>
              item.title.toLowerCase().includes(searchInput.toLowerCase())
            );
            setResults(filteredResults);
          })
          .catch(console.error);
      } else if (type === "albums") {
        // Tìm kiếm toàn bộ album nếu chưa chọn artist
        const filteredResults = data.filter((item) =>
          item.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setResults(filteredResults);
      } else {
        // Tìm kiếm artist, song hoặc khác
        const filteredResults = data.filter((item) => {
          const searchValue = searchInput.toLowerCase();
          return (
            item.name?.toLowerCase().includes(searchValue) ||
            item.title?.toLowerCase().includes(searchValue)
          );
        });
        setResults(filteredResults);
      }
      setIsDropdownVisible(true);
    } else {
      setResults([]);
      setIsDropdownVisible(false);
    }
  }, [searchInput, type, data, artistId]);

  const updateFilterButton = (name, id) => {
    setFilterName(name);
    if (type === "artist") {
      setArtist(id);
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: id });
    }

    if (type === "albums") {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: id });
    }

    if (type === "song") {
      dispatch({ type: actionType.SET_SONG_FILTER, songFilter: name });
    }
    setIsDropdownVisible(false);
  };

  // console.log(data);

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="flex items-center gap-2 outline-none shadow-sm border border-gray-300 rounded-md p-3">
        <IoSearch className="text-gray-400 text-xl" />
        <input
          type="text"
          placeholder={`Search ${type}`}
          className="w-full rounded-md text-base font-semibold text-textColor outline-none bg-transparent"
          value={filterName || searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClick={() => setFilterName("")}
        />
        <button
          onClick={() => {
            setSearchInput("");
            setFilterName("");
          }}
        >
          <FaTimes className="text-gray-400" />
        </button>
      </div>

      {/* Dropdown Results */}
      {isDropdownVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute mt-2 w-full bg-white z-10 border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                className="p-2 flex gap-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  updateFilterButton(item.name || item.title, item._id);
                }}
              >
                <img
                  src={item.imageUrl}
                  className="w-8 min-w-[32px] h-8 rounded-full object-cover"
                  alt=""
                />
                <p className="text-sm font-semibold">
                  {item.name || item.title}
                </p>
                <p className="text-xs text-gray-400">
                  {item.artist || item.additionalInfo || ""}
                </p>
              </div>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-500">No results found.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchComponent;
