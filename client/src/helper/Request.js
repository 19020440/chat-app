import { Header } from "antd/lib/layout/layout";
import axios from "axios";
import {LOCAL_STORGE} from '../helper/constant'
import {showMessageError, showMessageSuccess, showModalTimeOut, showMessageInfo} from '../helper/function'

export const Request = {
   async header() {
      const token = await sessionStorage.getItem(LOCAL_STORGE.TOKEN)
      let data = {};
      if(token) {
         data = {token: (token) };
      }
      return await axios.create({
         headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            token: data.token,
         }
      });
   },

   async post(data, url) {

      try {
         let api = await this.header();
         const result = await api.post(url, data);

         if(result.data.status == 1) {
            return result.data
         } else if(result.data.status  == 0) {
            showMessageError(result.data.content)
            // return result.data;
         }

      }catch(err) {
         showMessageError(err.message)
      }
   },
   async get(body, url) {
    
    let json;

    try {
      let api = await this.header();

      json = {
        params: body,
      };

        const result = await api.get(url, json);
        if(result.data.status == 1) {
         return result.data
      } else if(result.data.status  == 0) {
         showMessageError(result.data.content)
      }
      } catch (error) {

        if (error.message == "Network Error") {
          showMessageError("Không có kết nối. Vui lòng thử lại");
        } else if (error.message.indexOf("timeout of") != -1) {
          showMessageError(
              "Không thể kết nối đến hệ thống. Vui lòng thử lại sau"
          );
        } else if (error.message.indexOf("403") != -1) {
        } else {
          showMessageError(error.message);
        }
      }

  },

}
