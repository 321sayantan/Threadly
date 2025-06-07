const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const file = parts.pop(); // image_name.jpg
  // const folder = parts.pop(); // folder_name (optional)
  const imageName = file.split(".")[0]; // image_name
//   return `${folder}/${imageName}`;
  return `Instagram Clone/${imageName}`;
}

export default getPublicIdFromUrl;