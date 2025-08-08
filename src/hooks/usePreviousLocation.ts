import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

type Location = ReturnType<typeof useLocation>


/**
 * @function usePreviousLocation
 * @description previous location
 * @returns {Location}
 */
export default function usePreviousLocation(): Location {

  const location = useLocation();
  const previous = useRef(location);

  useEffect(() => {
    previous.current = location;
  }, [location]);

  return previous.current;
}