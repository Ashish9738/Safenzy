import { useEffect, useRef } from "react";

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};

export default useWebSocket;
