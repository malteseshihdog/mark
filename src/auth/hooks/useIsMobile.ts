import { useEffect, useState } from "react"
import is from "../scripts/is"

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true)

  // If there's a way to listen to user agent, add the logic in the useEffect
  useEffect(() => {
    setIsMobile(is.mobile())
  }, [])

  return isMobile
}
