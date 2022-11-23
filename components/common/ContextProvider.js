import Parse from "parse";
import { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";

const CurrentStateContext = createContext();
const MethodsContext = createContext();

export function useGetCurrentState() {
  return useContext(CurrentStateContext);
}

export function useGetMethods() {
  return useContext(MethodsContext);
}

export default function ContextProvider({ children }) {
  const [currentState, setCurrentState] = useState({});
  const [methods, setMethods] = useState({});
  const router = useRouter();

  const [immediateResult, setImmediateResult] = useState(null);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showCreateVariationModal, setShowCreateVariationModal] =
    useState(false);
  const [activeLink, setActiveLink] = useState(router.pathname);
  const [imageCount, setImageCount] = useState(3);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [query, setQuery] = useState("A woman working in the office");
  const [style, setStyle] = useState("Select style");
  const [medium, setMedium] = useState("Select medium");
  const [prompt, setPrompt] = useState("");
  const [isError, setIsError] = useState({
    value: false,
    message: ""
  })

  const [querySearch, setQuerySearch] = useState(
    "Describe the image you're looking for"
  );
  const [styleSearch, setStyleSearch] = useState("Select style");
  const [mediumSearch, setMediumSearch] = useState("Select medium");
  const [promptSearch, setPromptSearch] = useState("");

  const [galleryImages, setGalleryImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [searchFieldOptions, setSearchFieldOptions] = useState({
    styles: [
      { value: "select_style", label: "Select style" },
      { value: "realism", label: "Realism" },
      { value: "photorealism", label: "Photorealism" },
      { value: "expressionism", label: "Expressionism" },
      { value: "impressionism", label: "Impressionism" },
      { value: "abstract", label: "Abstract" },
      { value: "surrealism", label: "Surrealism" },
      { value: "pop_art", label: "Pop art" }
    ],
    mediums: [
      { value: "select_medium", label: "Select medium" },
      { value: "oil", label: "Oil" },
      { value: "watercolour", label: "Watercolour" },
      { value: "acrylic", label: "Acrylic" },
      { value: "gouache", label: "Gouache" },
      { value: "pastel", label: "Pastel" },
      { value: "encaustic", label: "Encaustic" },
      { value: "spray_paint", label: "Fresco" },
      { value: "digital", label: "Digital" },
    ],
  });

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    setCurrentState({
      showEditImageModal,
      showCreateVariationModal,
      activeLink,
      immediateResult,
      imageCount,
      showResetPassword,
      query,
      style,
      medium,
      prompt,
      querySearch,
      styleSearch,
      mediumSearch,
      promptSearch,
      searchFieldOptions,
      isSearching,
      galleryImages,
      showImageModal,
      isLoading,
      isError,
    });
  }, [
    showEditImageModal,
    showCreateVariationModal,
    activeLink,
    immediateResult,
    imageCount,
    showResetPassword,
    query,
    style,
    medium,
    prompt,
    querySearch,
    styleSearch,
    mediumSearch,
    promptSearch,
    searchFieldOptions,
    isSearching,
    galleryImages,
    showImageModal,
    isLoading,
    isError
  ]);

  useEffect(() => {
    setMethods({
      setShowEditImageModal,
      setShowCreateVariationModal,
      setActiveLink,
      setImmediateResult,
      setImageCount,
      setShowResetPassword,
      setQuery,
      setStyle,
      setPrompt,
      setMedium,
      setQuerySearch,
      setStyleSearch,
      setPromptSearch,
      setMediumSearch,
      setSearchFieldOptions,
      setIsSearching,
      setGalleryImages,
      setShowImageModal,
      setIsLoading,
      setIsError
    });
  }, []);

  return (
    <CurrentStateContext.Provider value={currentState}>
      <MethodsContext.Provider value={methods}>
        {children}
      </MethodsContext.Provider>
    </CurrentStateContext.Provider>
  );
}
