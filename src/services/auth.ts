import axios from ".";

import { Login, GetLoged, Logout } from "@/interfaces/services";

export const getLoged: GetLoged = async () => await axios.get("/auth/loged");

export const login: Login = async (username, password, rememberMe = false) =>
  await axios.post("/auth/signin", { username, password, rememberMe });

export const logout: Logout = async () =>
  await axios.delete("/auth/logout");
