import type { Character } from "@prisma/client"
import { prisma } from "~/db.server"

export const createCharacter = async (playerId: number): Promise<Character> => {
  return await prisma.character.create({
    data: {
      name: 'blank name',
      playerId: playerId,
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }
  })
}

export const getCharacter = async (playerId: number): Promise<Character | null> => {
  return await prisma.character.findUnique({where: {playerId: playerId}})
}

export const updateCharacter = async (data: Partial<Character>) => {
  return await prisma.character.update({where: {playerId: data.playerId}, data: {...data}})
}