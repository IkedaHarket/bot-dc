import IHttpClient from "./http-client.interface";
import axios from "axios";

class HttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    const { data } = await axios.get(url);
    return data;
  }
}

export default HttpClient;
