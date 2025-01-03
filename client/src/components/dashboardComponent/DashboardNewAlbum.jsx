import React, { useState } from "react";
import {
  ref,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../Context/StateProvider";
import {
  getAllAlbums,
  saveNewAlbum,
} from "../../api";
import { actionType } from "../../Context/reducer";
import AlertSuccess from "../AlertSuccess";
import AlertError from "../AlertError";
import SearchComponent from "../SearchComponent";
import { DisabledButton, ImageLoader, ImageUploader } from "./DashboardNewSong";

function DashboardNewAlbum () {
    const [isArtist, setIsArtist] = useState(false);
    const [artistProgress, setArtistProgress] = useState(0);
  
    const [alert, setAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);
    const [albumCoverImage, setalbumCoverImage] = useState(null);
    const [albumName, setAlbumName] = useState("");
  
    const [{ artists, artistFilter }, dispatch] = useStateValue();
  
    const deleteImageObject = (songUrl) => {
      setIsArtist(true);
      setalbumCoverImage(null);
      const deleteRef = ref(storage, songUrl);
      deleteObject(deleteRef).then(() => {
        setAlert("success");
        setAlertMsg("File removed successfully");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        setIsArtist(false);
      });
    };
  
    const saveAlbum = () => {
      if (!albumCoverImage || !artistFilter) {
        setAlert("error");
        setAlertMsg("Required fields are missing");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
      } else {
        setIsArtist(true);
        const data = {
          title: albumName,
          artistName: artistFilter,
          imageUrl: albumCoverImage,
        };
        saveNewAlbum(data).then((res) => {
          getAllAlbums().then((albumData) => {
            dispatch({
              type: actionType.SET_ALL_ALBUMNS,
              albumData: albumData.data,
            });
          });
        });
        setIsArtist(false);
        setalbumCoverImage(null);
        dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
        setAlert("success");
        setAlertMsg("New album saved successfully!");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        
      }
    };
  
    return (
      <div className="flex items-center justify-evenly w-full flex-wrap">
        <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isArtist && <ImageLoader progress={artistProgress} />}
          {!isArtist && (
            <>
              {!albumCoverImage ? (
                <ImageUploader
                  setimageUrl={setalbumCoverImage}
                  setAlert={setAlert}
                  alertMsg={setAlertMsg}
                  isLoading={setIsArtist}
                  setProgress={setArtistProgress}
                  isImage={true}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img
                    src={albumCoverImage}
                    alt="uploaded image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteImageObject(albumCoverImage);
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
  
        <div className="flex flex-col items-center justify-center gap-4 ">
          <input
            type="text"
            placeholder="Album Name"
            className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
           <SearchComponent type="artist" data={artists} />
  
          
          {/* <input
            type="text"
            placeholder="Artist Name"
            className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          /> */}
  
          <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
            {isArtist ? (
              <DisabledButton />
            ) : (
              <motion.button
                whileTap={{ scale: 0.75 }}
                className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                onClick={saveAlbum}
              >
                Send
              </motion.button>
            )}
          </div>
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
      </div>
    );
  };

  export default DashboardNewAlbum;