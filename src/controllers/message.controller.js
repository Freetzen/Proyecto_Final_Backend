import { getManagerMessages } from "../dao/daoManager.js";

const managerData = await getManagerMessages()
export const messageManager = new managerData.ManagerMessageMongoDB