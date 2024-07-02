"use client";

import type {
  ActionGetResponse,
  ActionPostResponse,
  LinkedAction,
} from "@/action";
import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";

type ActionProps = ActionGetResponse & { url: string };

export default function Home() {
  const [url, setUrl] = useState(
    "https://tiplink.io/api/blinks/donate?dest=GDQtcVPfjcWfrnNWjCCe7pP3ds55t1WRn83wppXs6Ntw"
  );
  const [data, setData] = useState<ActionGetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchUrl();
  };

  const fetchUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ActionGetResponse = await response.json();
      console.log("Data: %O", data);
      setData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const props: ActionProps = { ...data!, url };
  return (
    <div className="App">
      <h1>Fetch a Solana action and render the blink</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Action URL:
          <input type="url" value={url} onChange={handleUrlChange} size={100} />
        </label>
        <button type="submit">Fetch</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <ActionForm {...props} />}
    </div>
  );
}

const ActionForm = (data: ActionProps) => {
  const [input, setInput] = useState("");
  const handleButtonClick = async (href: string) => {
    // Implement the logic to handle donation click
    // This could involve redirecting the user to the href or making an API call
    console.log(`Redirecting to: ${href}`);
    href = new URL(href, data.url).toString();
    const res = await fetch(href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: "GrHyYxxFYPtzGyL1eJFJPQEmXVuw7dLHZye8xQU3z6xQ",
      }),
    });
    const tx: ActionPostResponse = await res.json();
    console.log(`Transaction: %O`, tx);
    alert(`Transaction: ${tx.transaction}`);
  };

  const renderActionButton = (action: LinkedAction) => {
    if (action.parameters) {
      const name = action.parameters[0].name;
      return (
        <div key={action.label}>
          <label>{action.parameters[0].label}: </label>
          <input type="text" onChange={(e) => setInput(e.target.value)} />
          <button
            key={action.label}
            onClick={(e) => {
              handleButtonClick(action.href.replace(`{${name}}`, input));
            }}
          >
            {action.label}
          </button>
        </div>
      );
    } else {
      return (
        <button
          key={action.label}
          onClick={() => handleButtonClick(action.href)}
        >
          {action.label}
        </button>
      );
    }
  };

  const buttons = data.links?.actions?.length
    ? data.links.actions.map(renderActionButton)
    : renderActionButton({
        label: data.label,
        href: data.url,
      });

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <Image
        src={data.icon}
        alt={data.label}
        height="400"
        width="400"
        unoptimized
      />
      <div>{buttons}</div>
    </div>
  );
};
