import React from 'react'

const QueueContext = React.createContext({});

export default function QueueContextProvider({ children } : { children: React.ReactNode}) {
  return (
    <QueueContext.Provider value={{}}>{children}</QueueContext.Provider>
  )
}
