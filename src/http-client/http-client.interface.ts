export default interface IHttpClient {
  get<T>(url: string): Promise<T>;
}
