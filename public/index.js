import { json, response } from "express";
import { createLogin } from "../login";
import { createNavigator } from "../navigator";

createLogin();
const formContainer = document.getElementById('form-container');
const tableContainer = document.getElementById('table-container');
const navigator = createNavigator(document.querySelector('#container'));

const createMiddleware = () => {
  return {
    load: async () => {
      return new Promise((resolve, reject) => {
        fetch("http://localhost:80/visits")
          .then((response) => response.json())
          .then((json) => {
            resolve(json);
          })
          .catch(reject);
      });
    },
    delete: async (id) => {
      const response = await fetch("/delete/" + id, {
        method: 'DELETE',
      });
      const json = await response.json();
      return json;
    },
    add: async (visit) => {
      return new Promise((resolve, reject) => {
        fetch("http://localhost:80/visits/add", {
          method: 'POST',
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              visits: visit
          })
        })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
      });
    }
  };
};


  export default createMiddleware;