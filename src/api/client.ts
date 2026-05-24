import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});
