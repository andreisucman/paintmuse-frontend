import Parse from "parse";

export async function fetchLatestPlaceholders({
  limit,
  imageSetter,
  querySetter,
  mediumSetter,
  styleSetter,
  page,
  fetchOnce,
  functionName,
  fields,
  setSelectedImage,
  customerId,
}) {
  try {
    const response = await Parse.Cloud.run(`${functionName}`, {
      limit,
      fields,
      page,
      fetchOnce,
      customerId
    });

    if (setSelectedImage) {
      setSelectedImage(response[0]);
    }

    imageSetter(response);

    if (querySetter) {
      querySetter(
        `${response[0].query.charAt(0).toUpperCase()}${response[0].query.slice(
          1
        )}`
      );
    }
    if (mediumSetter) {
      mediumSetter(response[0].medium);
    }
    if (styleSetter) {
      styleSetter(response[0].style);
    }
  } catch (err) {
    console.log(err);
  }
}
