import { baseURL } from "../../services";

const LOCAL = "http://127.0.0.1:7009/api";
const PROD = "https://discplinamobilenoite.onrender.com/api";

const BASE_URL = baseURL

const fetchComTimeout = (url, options, timeout = 9000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Tempo limite excedido")), timeout)
    ),
  ]);
};

export { BASE_URL,fetchComTimeout };
