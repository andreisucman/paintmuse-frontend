
export function uploadToClient(e, setterFile, setterUrl) {
  if (e.target.files && e.target.files[0]) {
    const i = e.target.files[0];

    setterFile(i);
    if (setterUrl) {
      setterUrl(URL.createObjectURL(i));
    }
  }
}