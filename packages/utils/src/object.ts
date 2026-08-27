export const omit = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> => {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}
