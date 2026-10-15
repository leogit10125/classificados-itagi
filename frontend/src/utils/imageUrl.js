import { UPLOADS_URL } from "../config/api";

export function getImageUrl(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${UPLOADS_URL}/${image.replace(/^\/+/, "")}`;
}
