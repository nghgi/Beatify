import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useStateValue } from "../Context/StateProvider";
import { updateUserProfile } from "../api"; // API function để cập nhật thông tin user
import { ImageLoader, ImageUploader } from "./DashboardNewSong";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

const UserProfile = () => {
  const [{ user }, dispatch] = useStateValue();
  const [editable, setEditable] = useState(false); // Chế độ chỉnh sửa
  const [userData, setUserData] = useState({
    _id: "",
    username: "",
    email: "",
    role: "",
    imageURL: "",
  });

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [setAlert, setSetAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Khi component được mount, lấy dữ liệu user từ context và set state
  useEffect(() => {
    if (user) {
      setUserData({
        _id: user.user._id,
        username: user.user.username || "",
        email: user.user.email || "",
        role: user.user.role || "",
        imageURL: user.user.imageURL || "",
      });
    }
  }, [user]);

  // Xử lý sự kiện thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateUserData = () => {
    const usernameRegex = /^[\p{L}\p{M}\s-]{3,64}$/u // Tên phải từ 3 đến 64 ký tự, cho phép chữ, số, khoảng trắng, gạch ngang, và gạch dưới
    return usernameRegex.test(userData.username);
  };

  // Xử lý sự kiện lưu thông tin
  const handleSave = async () => {
    try {
      const updatedData = { ...userData, imageURL: imageURL || userData.imageURL, };
      const updatedUser = await updateUserProfile(userData._id, updatedData);
      dispatch({
        type: "SET_USER",
        user: updatedUser,
      });
      setEditable(false); // Tắt chế độ chỉnh sửa
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update profile.");
    }
  };

  const deleteImageObject = (URL) => {
    setIsImageLoading(true);
    setImageURL(null);
    const deleteRef = ref(storage, URL);
    deleteObject(deleteRef).then(() => {
      setSetAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
    });
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="w-3/4 md:w-1/2 bg-lightOverlay p-6 rounded-md shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-center min-h-[120px]">
            <img
              src={userData.imageURL}
              alt=""
              className="w-24 h-24 min-w-[44px] min-h-[44px] object-cover rounded-full shadow-lg"
            />
            <div
              className={`${
                editable ? "" : "hidden"
              } border-2 p-1 ml-3 rounded`}
            >
              {isImageLoading && <ImageLoader progress={uploadProgress} />}
              {!isImageLoading && (
                <>
                  {!imageURL ? (
                    <ImageUploader
                      setImageURL={setImageURL}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsImageLoading}
                      setProgress={setUploadProgress}
                      isImage={true}
                    />
                  ) : (
                    <div className="relative w-full h-full ">
                      <img
                        src={imageURL}
                        alt="uploaded image"
                        className="w-24 h-24 min-w-[44px] min-h-[44px] object-cover rounded-full shadow-lg"
                      />
                      <button
                        type="button"
                        className="absolute bottom-1 right-1 p-2 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(imageURL);
                        }}
                      >
                        <MdDelete className="text-white size-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Username */}
          <div className="flex flex-col">
            <label className="font-semibold">Username:</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              readOnly={!editable}
              className={`p-2 border ${
                editable ? "border-blue-500" : "border-gray-300"
              } rounded-md`}
            />
            {!validateUserData() && (
              <p className="text-red-500 text-sm">
                Username must be between 3 and 64 characters long and can contain letters, numbers, spaces, underscores, and hyphens.
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              readOnly
              className="p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500">Email cannot be changed.</p>
          </div>

          {/* Edit and Save Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            {editable ? (
              <>
                <button
                  onClick={() => setEditable(false)} // Cancel editing
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md ${
                    validateUserData() ? "bg-green-500" : "bg-gray-400"
                  } text-white`}
                  disabled={!validateUserData()}
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditable(true)} // Enable editing
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
