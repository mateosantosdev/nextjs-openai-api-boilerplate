import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { FormEvent, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sendToApi = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      return response.json();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    sendToApi(inputText).then((apiResponse) => {
      setResponse(JSON.stringify(apiResponse));
    });
  };

  return (
    <>
      <Head>
        <title>Playing with OpenAI api</title>
        <meta name="description" content="Playing with OpenAI api" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Mateo Santos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={inter.className}>
          <h1>OpenAI API test</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.query}>
              <input
                required
                id="query"
                name="query"
                type="text"
                value={inputText}
                className={styles.input}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setInputText(e.currentTarget.value)
                }
                placeholder="Enter your query:"
              />
            </div>
            <input
              type="submit"
              value={isLoading ? "Waiting to OpenAi..." : "Send query"}
              disabled={isLoading}
              className={styles.submit}
            />
          </form>
        </div>
      </main>
      {response !== "" && <div className={styles.response}>{response}</div>}
    </>
  );
}
