import { createLogin } from "../login";
import { createNavigator } from "../navigator";

createLogin();
const formContainer = document.getElementById('form-container');
const tableContainer = document.getElementById('table-container');
const navigator = createNavigator(document.querySelector('#container'));

const createMiddleware = () => {
    return {
      load: async () => {
        const response = await fetch("/visits");
        const json = await response.json();
        return json;
      },
      delete: async (id) => {
        const response = await fetch("/delete/" + id, {
          method: 'DELETE',
        });
        const json = await response.json();
        return json;
      },
      add: async (visit) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                visits: visits
            })
        });
        const json = await response.json();
        return json;        
      }
    }
  }

  export default createMiddleware;