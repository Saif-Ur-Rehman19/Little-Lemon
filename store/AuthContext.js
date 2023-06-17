import { createContext } from "react";

export const AppContext = createContext({
    isOnboardingCompleted: {},
    setIsOnboardingCompleted: () => {}
})