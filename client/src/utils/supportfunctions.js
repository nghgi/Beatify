import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 2, title: "Jasp", value: "jasp" },
  { id: 3, title: "Rock", value: "rock" },
  { id: 4, title: "Melody", value: "melody" },
  { id: 5, title: "Karoke", value: "karoke" },
];

export const filterByLanguage = [
  { id: 1, title: "Tiếng Việt", value: "vtitlese" },
  { id: 2, title: "English", value: "english" },
  { id: 2, title: "日本語", value: "jpnese" },
];

export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};
