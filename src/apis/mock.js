import axios from "../utils/axios";

export default {
  gethomeData() {
    return axios.get("/api/gethomeData");
  },
  getMenuList() {
    return axios.get("/api/getMenuList");
  },
};
