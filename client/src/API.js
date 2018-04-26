import axios from "axios";

export default {
  loginUser: function(loginData) {
    return axios.post("/api/shelves/signin", loginData);
  },
  logoutUser: function(logoutData) {
  	return axios.post("api/shelves/signout", logoutData);
  }
};