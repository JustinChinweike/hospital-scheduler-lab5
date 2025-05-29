import { useEffect , useState} from "react";
import axios from "axios";

export function useOffline() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerUp, setIsServerUp] = useState(true); 

    useEffect(()=> {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // ping the server every 5 seconds
        const interval = setInterval(async() => {
            try { 
                await axios.get("http://localhost:5000/health"); 
                setIsServerUp(true);
            }catch {
                setIsServerUp(false);
            }           
        }, 10000); 
        
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, []);

    return {isOnline, isServerUp};
}
