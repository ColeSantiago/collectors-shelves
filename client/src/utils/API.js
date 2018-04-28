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
  updateBio: function(userBio) {
  	return axios.post("/api/shelves/profile", userBio);
  },
  createCollection: function(collectionData) {
  	return axios.post("/api/shelves/addcollection", collectionData);
  },
  loadCollections: function() {
  	return axios.get("/api/shelves/profile");
  }
};