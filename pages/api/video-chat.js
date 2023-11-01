// /pages/api/transcript.js
import { YoutubeTranscript } from "youtube-transcript";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";

let chain;
let chatHistory = [];

// DO THIS SECOND
const initializeChain = async (initialPrompt, transcript) => {
  try {
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo",
    });

    const vectorStore = await HNSWLib.fromDocuments(
      [{ pageContent: transcript }],
      new OpenAIEmbeddings()
    );

    chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      { verbose: true } // Add verbose option here
    );

    // It requires two inputs: a question and the chat history. It first combines the chat history and the question into a standalone question, then looks up relevant documents from the retriever, and then passes those documents and the question to a question answering chain to return a response.
    const response = await chain.call({
      question: initialPrompt,
      chat_history: chatHistory,
    });

    // Update history
    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    console.log({ chatHistory });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // DO THIS FIRST
    // First we'll destructure the prompt and firstMsg from the POST request body
    const { prompt } = req.body;
    const { firstMsg } = req.body;

    // Then if it's the first message, we want to initialize the chain, since it doesn't exist yet
    if (firstMsg) {
      console.log("Initializing chain");

      try {
        // So first of all, we want to give it our human message, which was to ask for a summary of the YouTube URL
        const initialPrompt = `Give me a summary of the transcript: ${prompt}`;

        chatHistory.push({
          role: "user",
          content: initialPrompt,
        });

        // Here, we'll use a generic YouTube Transcript API to get the transcript of a youtube video
        // As you can see, the Transcript takes videoId/videoURL has the first argument to the function
        const transcriptResponse = await YoutubeTranscript.fetchTranscript(
          prompt
        );

        // and we'll just add some error handling in case the API fails
        if (!transcriptResponse) {
          return res.status(400).json({ error: "Failed to get transcript" });
        }

        // Now let's see what that transcriptResponse looks like

        // We initialize the transcript string
        let transcript = "";

        transcriptResponse.forEach((line) => {
          transcript += line.text;
        });

        const response = await initializeChain(initialPrompt, transcript);
        console.log(transcript);

        return res.status(200).json({ output: response, chatHistory });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching transcript" });
      }

      // DO THIS THIRD
    } else {
      // If it's not the first message, we can chat with the bot
      console.log("Received question");
      try {
        chatHistory.push({
          role: "user",
          content: prompt,
        });
        // Then we'll pass the entire chat history with all the previous messages back
        const response = await chain.call({
          question: prompt,
          chat_history: chatHistory,
        });
        // And we'll add the response back as well
        chatHistory.push({
          role: "assistant",
          content: response.text,
        });

        return res.status(200).json({ output: response, chatHistory });
      } catch (error) {
        // Generic error handling
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred during the conversation." });
      }
    }
  }
}

// // /pages/api/transcript.js
// import { YoutubeTranscript } from "youtube-transcript";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { ConversationalRetrievalQAChain } from "langchain/chains";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { CharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAI } from "langchain";

// // Global variables

// // DO THIS SECOND
// const initializeChain = async (initialPrompt, transcript) => {
//   try {
//     console.log({ chatHistory });
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     // DO THIS FIRST

//     // Then if it's the first message, we want to initialize the chain, since it doesn't exist yet
//     if (x) {
//       try {
//         // And then we'll jsut get the response back and the chatHistory
//         return res.status(200).json({ output: response, chatHistory });
//       } catch (err) {
//         console.error(err);
//         return res
//           .status(500)
//           .json({ error: "An error occurred while fetching transcript" });
//       }

//       // do this third!
//     } else {
//       // If it's not the first message, we can chat with the bot

//       try {
//         return res.status(200).json({ output: response, chatHistory });
//       } catch (error) {
//         // Generic error handling
//         console.error(error);
//         res
//           .status(500)
//           .json({ error: "An error occurred during the conversation." });
//       }
//     }
//   }
// }
