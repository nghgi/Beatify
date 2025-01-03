import React from "react";
import { motion } from "framer-motion";
import { SongCard } from "../dashboardComponent/DashboardSongs";

const AlbumSongsModal = ({ album, songs, closeModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 min-w-[1200px] min-h-fit max-h-[600px]">
        <h2 className="text-xl font-bold mb-4">{album?.title}</h2>
        <p className="text-sm text-gray-500 mb-4">Songs in this album:</p>
        <div className="flex gap-4">
          {songs.length > 0 ? (
            songs.map((song, i) => (
              //   <li key={song._id} className="flex justify-between items-center">
              //     <span>{song.title}</span>
              //   </li>
              <SongCard
                key={song._id}
                data={song}
                index={i}
                type={"removeable"}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No songs found in this album.
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
    </motion.div>
  );
};

export default AlbumSongsModal;
