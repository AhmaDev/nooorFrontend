"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL =
  // process.env.baseURL || process.env.apiUrl || "";
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL:
    process.env.baseURL || process.env.apiUrl || "http://localhost:3200/api/",
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  // baseUrl: "http://localhost:3600/",
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  },
);

Plugin.install = function (Vue, options) {
  Vue.vdocipher = _axios;
  window.vdocipher = _axios;
  Object.defineProperties(Vue.prototype, {
    vdocipher: {
      get() {
        return _axios;
      },
    },
    $vdocipher: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
