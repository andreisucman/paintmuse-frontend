import axios from "axios";
import Counter from "./Counter";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FilterField from "./FilterField";
import { useGetMethods, useGetCurrentState } from "./ContextProvider";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import { handleQueryEntry } from "../../helpers/handleQueryEntry";
import { handleSetPrompt } from "../../helpers/handleSetPrompt";
import styles from "../../styles/components/common/SearchField.module.scss";

export default function SearchField({
  text,
  countSelection,
  style,
  medium,
  extraPadding,
}) {
  const { setQuery, setStyle, setPrompt, setMedium, setIsLoading, setIsError } =
    useGetMethods();
  const { imageCount, query, prompt, searchFieldOptions, isError } =
    useGetCurrentState();
  const [showFields, setShowFields] = useState(false);
  const currentUser = useGetCurrentUser();
  const router = useRouter();

  useEffect(() =>{
    setTimeout(() => {
      setShowFields(true);
    }, 750)
  }, [])

  useEffect(() => {
    handleSetPrompt(
      medium,
      query,
      style,
      prompt,
      undefined,
      undefined,
      setPrompt
    );
  }, [medium, style, prompt, query, setMedium, setPrompt, setQuery, setStyle]);

  function handleGenerate() {
    if (!currentUser) {
      router.push("/login");
    } else {
      handleRequestImages();
    }
  }

  async function handleRequestImages() {
    if (!currentUser) return;

    try {
      setIsLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/requestImages`,
        {
          prompt,
          count: imageCount,
          customerId: currentUser.customerId,
          style,
          medium,
          query,
        },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      setIsLoading(false);
      setIsError(
        Object.assign({}, isError, {
          value: true,
          message: `Make sure your text length is less than 1000 characters and doesn't include sexually suggestive or discriminatory words.`,
        })
      );
    }
  }

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
        placeholder={query}
        onChange={(e) => handleQueryEntry(e.target.value, setQuery)}
        className={styles.search__bar}
      />
      <div className={styles.search__buttons}>
        {showFields && (
          <>
            <FilterField
              options={searchFieldOptions.styles}
              defaultValue={{
                value: style,
                label: style,
              }}
              setter={setStyle}
            />
            <FilterField
              options={searchFieldOptions.mediums}
              defaultValue={{
                value: medium,
                label: medium,
              }}
              setter={setMedium}
            />
          </>
        )}
        {countSelection && <Counter />}
        <button
          type="submit"
          className={styles.search__button}
          onClick={handleGenerate}
        >
          <span className={styles.search__button_text}>{text}</span>
        </button>
      </div>
    </div>
  );
}
