import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useStateValue } from "../../Context/StateProvider";
import { Link, NavLink } from "react-router-dom";
import { IoAdd, IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllArtist, deleteArtistById, getAlbumsByArtist } from "../../api";
import { actionType } from "../../Context/reducer";
import AlertError from "../AlertError";
import AlertSuccess from "../AlertSuccess";
import { AiOutlineClear } from "react-icons/ai";
import ArtistAlbumModal from "../modal/ArtistAlbumModal";

const DashboardArtist = () => {
  const [{ artists }, dispatch] = useStateValue();
  const [artistFilter, setArtistFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredArtists, setFilteredArtists] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }
  }, []);

  useEffect(() => {
    if (artistFilter.length > 0) {
      const filtered = artists.filter((data) =>
        data.name.toLowerCase().includes(artistFilter.toLowerCase())
      );
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists(null);
    }
  }, [artistFilter]);

  const openModal = (artist) => {
    setSelectedArtist(artist);
    getAlbumsByArtist(artist._id).then((res) => {
      setAlbums(res || []);
      setIsModalOpen(true);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtist(null);
    setAlbums([]);
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24 mb-4">
        <NavLink
          to={"/dashboard/newArtist"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            artistFilter.length > 0
              ? "border-gray-500 shadow-md"
              : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
        />
        {artistFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setArtistFilter("");
              setFilteredArtists(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        )}
      </div>
      <div className="relative w-full gap-3 my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        {(filteredArtists || artists)?.map((data, index) => (
          <ArtistCard
            key={index}
            data={data}
            index={index}
            openModal={openModal}
            type={"removeable"}
          />
        ))}
      </div>
      {isModalOpen && (
        <ArtistAlbumModal
          artist={selectedArtist}
          albums={albums}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export const ArtistCard = ({ data, index, openModal, type }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [{ artists }, dispatch] = useStateValue();

  const deleteObject = (id) => {
    console.log(id);
    deleteArtistById(id).then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        setAlert("success");
        setAlertMsg(res.data.msg);
        getAllArtist().then((data) => {
          dispatch({
            type: actionType.SET_ARTISTS,
            artists: data.data,
          });
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
        className="relative w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
        onClick={() => openModal(data)}
      >
        <img
          src={data?.imageUrl}
          className="w-full h-40 object-cover rounded-md"
          alt=""
        />
        <p className="text-base text-textColor">{data.name}</p>
        <div className="flex items-center gap-4">
          <a href={data.instagram} target="_blank">
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoInstagram
                className={`text-gray-500 ${
                  data.instagram ? `hover:text-headingColor` : `cursor-default`
                } text-xl`}
              />
            </motion.i>
          </a>
          <a href={data.twitter} target="_blank">
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoTwitter
                className={`text-gray-500 ${
                  data.twitter ? `hover:text-headingColor` : `cursor-default`
                } text-xl`}
              />
            </motion.i>
          </a>
        </div>

        {alert && (
          <>
            {alert === "success" ? (
              <AlertSuccess msg={alertMsg} />
            ) : (
              <AlertError msg={alertMsg} />
            )}
          </>
        )}
      </motion.div>
      {type === "removeable" && (
        <motion.i
          className="absolute bottom-2 right-2"
          whileTap={{ scale: 0.75 }}
          onClick={() => setIsDeleted(true)}
        >
          <MdDelete className=" text-gray-400 hover:text-red-400 text-xl cursor-pointer" />
        </motion.i>
      )}
      {isDeleted && (
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
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-teal-400"
              onClick={() => deleteObject(data._id)}
            >
              Yes
            </button>
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              No
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardArtist;
