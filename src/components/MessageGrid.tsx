import { useEffect, useState } from "react";
import { FixMessage } from "../interfaces/FixMessage";

function MessageGrid() {
  const [messages, setMessages] = useState<FixMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let dataPresent: boolean = false;

  useEffect(() => {
    const fetchFixMessages = async () => {
      try {
        const response = await fetch("http://localhost:8080/messages");
        const data = await response.json();
        dataPresent = true;
        setMessages(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          //throw err;
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFixMessages();

    const intervalId = setInterval(fetchFixMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading....</p>;
  if (error)
    return (
      <h3 className="bg-dark text-white text-center">
        Something went wrong with API Call.
      </h3>
    );

  return (
    <div className="container text-center">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">FIX Version</th>
            <th scope="col">Message Type</th>
            <th scope="col">Message Text</th>
          </tr>
        </thead>
        <tbody>
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <tr key={message.messageText}>
                <th>{message.fixVersion}</th>
                <td>{message.messageType}</td>
                <td>{message.messageText}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No Data Available</td>
            </tr>
          )}
        </tbody>
      </table>{" "}
    </div>
  );
}

export default MessageGrid;
