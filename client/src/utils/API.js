import axios from "axios";

export default {
  createUser: function(newUserData) {
    return axios.post("/api/shelves/signup", newUserData);
  },
  getUser: function() {
    return axios.get("/api/shelves/dashboard");
  },
  scrapeArticles: function() {
  	return axios.get("/api/shelves/dashboard");
  },
  getUserProfile: function() {
  	return axios.get("/api/shelves/profile");
  },
  updateBio: function(userBio) {
  	return axios.post("/api/shelves/profile", userBio);
  },
  createCollection: function(collectionData) {
  	return axios.post("/api/shelves/addcollection", collectionData);
  },
  loadAllCollections: function() {
  	return axios.get("/api/shelves/profile");
  },
  loadCollection: function(collectionId) {
  	return axios.get("/api/shelves/collection/" + collectionId);
  },
  savePhoto: function(photoData) {
  	return axios.post("/api/shelves/photoupload", photoData);
  },
  deletePhoto: function(photoId) {
  	return axios.post("/api/shelves/photodelete", photoId);
  },
  loadPhoto: function(photoId) {
  	return axios.get("/api/shelves/editphoto/" + photoId);
  },
  updatePhoto: function(titleData) {
  	return axios.post("/api/shelves/edittitle", titleData);
  }
};