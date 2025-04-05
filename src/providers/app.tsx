'use client'
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react'

export interface AppContextInterface {
  postsView: 'GRID' | 'LIST'
  setPostsView: Dispatch<SetStateAction<'GRID' | 'LIST'>>
}

const defaultAppContext: AppContextInterface = {
  postsView: 'LIST',
  setPostsView: () => {},
}

const AppContext = createContext<AppContextInterface>(defaultAppContext)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [postsView, setPostsView] = useState<AppContextInterface['postsView']>(defaultAppContext.postsView)

  return <AppContext.Provider value={{ postsView, setPostsView }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
