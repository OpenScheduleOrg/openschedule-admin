import axios from ".";

import { CreateCliente} from "@/interfaces/services";

export const createCliente: CreateCliente = async (cliente) => axios.post("/cliente", cliente)

