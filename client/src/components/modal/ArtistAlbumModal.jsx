import React, { useState } from "react";
import { motion } from "framer-motion";
import { SongCard } from "../dashboardComponent/DashboardSongs";
import { AlbumCard } from "../dashboardComponent/DashboardAlbum";
import { getSongsByAlbumId } from "../../api";
import AlbumSongsModal from "./AlbumSongModal";

const ArtistAlbumModal = ({ aritst, albums, closeModal }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
      const openModal = (album) => {
        setSelectedAlbum(album);
        getSongsByAlbumId(album._id).then((res) => {
          setSongs(res.data || []);
          setIsModalOpen(true);
        });
      };
    
      const closeSecondModal = () => {
        setIsModalOpen(false);
        setSelectedAlbum(null);
        setSongs([]);
      };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 min-w-[1200px] min-h-fit max-h-[600px]">
        <h2 className="text-xl font-bold mb-4">{aritst?.name}</h2>
        <p className="text-sm text-gray-500 mb-4">Albums by this artist:</p>
        <div className="flex gap-4">
          {albums.length > 0 ? (
            albums.map((data, i) => (
              <AlbumCard
                key={i}
                data={data}
                index={i}
                openModal={openModal}
                type={"removeable"}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No album found in this artist profile.
            </p>
          )}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
      {isModalOpen && (
        <AlbumSongsModal
          album={selectedAlbum}
          songs={songs}
          closeModal={closeSecondModal}
        />
      )}
    </motion.div>
  );
};

export default ArtistAlbumModal;
