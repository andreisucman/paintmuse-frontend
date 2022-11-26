import { useEffect } from "react";
import FilterField from "./FilterField";
import { useGetMethods, useGetCurrentState } from "./ContextProvider";
import { handleQueryEntry } from "../../helpers/handleQueryEntry";
import { handleSetPrompt } from "../../helpers/handleSetPrompt";
import { handleSearchImages } from "../../helpers/handleSearchImages";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import styles from "../../styles/components/common/SearchField.module.scss";

export default function SearchFieldDB({
  text,
  filterField,
  setPage,
  page,
  galleryImages,
  setGalleryImages,
  setSelectedImage,
  extraPadding,
  customerId
}) {
  const {
    setQuerySearch,
    setStyleSearch,
    setPromptSearch,
    setMediumSearch,
    setIsSearching,
  } = useGetMethods();

  const {
    isSearching,
    querySearch,
    styleSearch,
    mediumSearch,
    promptSearch,
    searchFieldOptions,
  } = useGetCurrentState();

  useEffect(() => {
    handleSetPrompt(
      mediumSearch,
      querySearch,
      styleSearch,
      promptSearch,
      page,
      setPage,
      setPromptSearch
    );
  }, [
    mediumSearch,
    styleSearch,
    promptSearch,
    querySearch,
    setMediumSearch,
    setPromptSearch,
    setQuerySearch,
    setStyleSearch,
  ]);

  return (
    <div
      className={
        extraPadding
          ? `${styles.search} ${styles.search_extra_padding}`
          : styles.search
      }
    >
      <input
        type="text"
        name="text_to_image_query"
        placeholder={querySearch}
        onChange={(e) => handleQueryEntry(e.target.value, setQuerySearch)}
        className={styles.search__bar}
      />
      <div className={styles.search__buttons}>
        {filterField && searchFieldOptions && (
          <>
            <FilterField
              options={searchFieldOptions.styles}
              defaultValueSearch={{
                value: styleSearch,
                label: styleSearch,
              }}
              setter={setStyleSearch}
            />
            <FilterField
              options={searchFieldOptions.mediums}
              defaultValueSearch={{
                value: mediumSearch,
                label: mediumSearch,
              }}
              setter={setMediumSearch}
            />
          </>
        )}
        <button
          type="submit"
          className={styles.search__button}
          onClick={() =>
            handleSearchImages({
              page,
              query: querySearch,
              galleryImages,
              setGalleryImages,
              style: styleSearch,
              medium: mediumSearch,
              isSearching,
              setIsSearching,
              setSelectedImage,
              customerId,
              fields: ["query", "medium", "style", "url", "imageId"]
            })
          }
        >
          <span className={styles.search__button_text}>{text}</span>
        </button>
      </div>
    </div>
  );
}
