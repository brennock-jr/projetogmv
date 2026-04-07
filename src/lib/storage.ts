import { kv } from '@vercel/kv'

export interface StorageStore {
  get: (key: string) => Promise<any>
  set: (key: string, value: any) => Promise<void>
  delete: (key: string) => Promise<void>
  list: (options?: { prefix?: string }) => Promise<{ key: string }[]>
}

export function getGenericStore(name: string): StorageStore {
  const prefix = `${name}:`
  
  return {
    get: async (key: string) => {
      return await kv.get(prefix + key)
    },
    set: async (key: string, value: any) => {
      await kv.set(prefix + key, value)
    },
    delete: async (key: string) => {
      await kv.del(prefix + key)
    },
    list: async (options) => {
      // Usando SCAN para listar chaves com o prefixo
      const keys: string[] = []
      let cursor = 0
      const matchPattern = prefix + (options?.prefix || '') + '*'
      
      do {
        const [nextCursor, foundKeys] = await kv.scan(cursor, { match: matchPattern })
        keys.push(...foundKeys)
        cursor = Number(nextCursor)
      } while (cursor !== 0)

      return keys.map(k => ({ key: k.replace(prefix, '') }))
    }
  }
}
