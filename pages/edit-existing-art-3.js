import Parse from "parse";
import axios from "axios";
import Link from "next/link";
// import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Buttons from "../components/common/Buttons";
import placeholder from "../public/assets/placeholder_arrows.svg";
import Counter from "../components/common/Counter";
import {
  useGetCurrentState,
  useGetMethods,
} from "../components/common/ContextProvider";
import { useGetCurrentUser } from "../helpers/useCurrentUser";
import { handleQueryEntry } from "../helpers/handleQueryEntry";
import { uploadToClient } from "../helpers/uploadToClient";
import { fetchGalleryImages } from "../helpers/fetchGalleryImages";
import ReactLoading from "react-loading";
import ErrorPopUp from "../components/common/ErrorPopUp";
import CropperModal from "../components/common/Cropper";
import Crop2 from "../components/common/Crop2";

export default function EditExistingArt() {
  
  return (
    <div >
      <Crop2 />
    </div>
  );
}
