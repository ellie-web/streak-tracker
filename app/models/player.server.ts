import type { Player } from "@prisma/client"
import { prisma } from "~/db.server"

export const getPlayersAll = async (): Promise<Player[]> => {
  return await prisma.player.findMany({})
}