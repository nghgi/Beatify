import React, { useEffect, useState } from "react";
import { useStateValue } from "../../Context/StateProvider";

import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { actionType } from "../../Context/reducer";
import { deleteAlbumById, getAllAlbums, getSongsByAlbumId } from "../../api";
import { NavLink } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import AlbumSongsModal from "../modal/AlbumSongModal";

const DashboardAlbum = () => {
  const [albumFilter, setAlbumFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredAlbums, setFilteredAlbums] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [{ allAlbums }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
      });
    }
  }, []);

  useEffect(() => {
    if (albumFilter.length > 0) {
      const filtered = allAlbums.filter(
        (data) =>
          data.title.toLowerCase().includes(albumFilter.toLowerCase()) ||
          data.artistId?.name?.toLowerCase().includes(albumFilter.toLowerCase())
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(null);
    }
  }, [albumFilter]);

  const openModal = (album) => {
    setSelectedAlbum(album);
    getSongsByAlbumId(album._id).then((res) => {
      setSongs(res.data || []);
      setIsModalOpen(true);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
    setSongs([]);
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/dashboard/newAlbum"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>

        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {albumFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setAlbumFilter("");
              setFilteredAlbums(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        )}
      </div>
      <div className="relative w-full gap-3 my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        {filteredAlbums?.length === 0 ? (
          <div>No result found</div>
        ) : (
          (filteredAlbums || allAlbums)?.map((data, index) => (
            <AlbumCard
              key={index}
              data={data}
              index={index}
              openModal={openModal}
              type={"removeable"}
            />
          ))
        )}
      </div>
      {isModalOpen && (
        <AlbumSongsModal
          album={selectedAlbum}
          songs={songs}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export const AlbumCard = ({ data, index, openModal, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [{}, dispatch] = useStateValue();

  const deleteObject = (id) => {
    console.log(id);
    deleteAlbumById(id).then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        setAlert("success");
        setAlertMsg(res.data.msg);
        getAllAlbums().then((data) => {
          dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
        });
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      } else {
        setAlert("error");
        setAlertMsg(res.data.msg);
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      }
    });
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative  overflow-hidden w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
        onClick={() => openModal(data)}
      >
        <img
          src={data?.imageUrl}
          className="w-full h-40 object-cover rounded-md"
          alt=""
        />
        <p className="text-base text-textColor">{data.title}</p>
        <p className="text-sm text-gray-400">{data.artistId?.name}</p>

      </motion.div>
      {type === "removeable" && (
        <motion.i
          className="absolute z-2 bottom-2 right-2"
          whileTap={{ scale: 0.75 }}
          onClick={() => setIsDelete(true)}
        >
          <MdDelete className=" text-gray-400 hover:text-red-400 text-xl cursor-pointer" />
        </motion.i>
      )}

{isDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 p-2 bg-darkOverlay  backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <p className="text-gray-100 text-base text-center">
              Are you sure do you want to delete this?
            </p>
            <div className="flex items-center w-full justify-center gap-3">
              <div
                className="bg-red-300 px-3 rounded-md"
                onClick={() => deleteObject(data._id)}
              >
                <p className="text-headingColor text-sm">Yes</p>
              </div>
              <div
                className="bg-green-300 px-3 rounded-md"
                onClick={() => setIsDelete(false)}
              >
                <p className="text-headingColor text-sm">No</p>
              </div>
            </div>
          </motion.div>
        )}
    </div>
  );
};

export default DashboardAlbum;
