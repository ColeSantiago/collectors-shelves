import axios from "axios";

export default {
  createUser: function(newUserData) {
    return axios.post("/api/shelves/signup", newUserData);
  },

  loginUser: function(loginData) {
    return axios.post("/api/shelves/signin", loginData);
  }
};