import axios from "axios";

export default {
  loginUser: function(loginData) {
    return axios.post("/api/shelves/signin", loginData);
  }
};