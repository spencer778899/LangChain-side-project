import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";

// export env 到 global, 這個 state 會被儲存在 terminal
// export OPENAI_API_KEY=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 && export SERPAPI_API_KEY=cfbff5f14e88a032c7176d3290f800221d0b68a37fa4454c079799ccbe211f01

// ### basic Chain (Model + Chain) ###

// const template =
//   "請幫我想一個關於 {topic} 的 {language} 文案。這個文案將在 {socialplatform} 發布。";
// const prompt = new PromptTemplate({
//   template: template,
//   inputVariables: ["topic", "socialplatform", "language"],
// });

// const model = new OpenAI({
//   temperature: 0.9,
// });
// const chain = new LLMChain({ llm: model, prompt: prompt });

// const resChain = await chain.call({
//   topic: "招募餐廳外場服務生",
//   socialplatform: "facebook",
//   language: "繁體中文",
// });

// console.log({ resChain });

// ### Memory (Model + Chains + Memory) ###

// const llm = new OpenAI({});
// const memory = new BufferMemory();
// const conversationChain = new ConversationChain({ llm: llm, memory: memory });

// const res1 = await conversationChain.call({
//   input: "My name is Spencer",
// });

// console.log(res1);

// const res2 = await conversationChain.call({
//   input: "what is my name",
// });

// console.log(res2);

// ### Agent (Model + Chains + Memory)

const agentModel = new OpenAI({
  temperature: 0,
  modelName: "text-davinci-003",
});

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Dallas,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  //
];

const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 5,
});
console.log("Loaded agent.");
const input = "What is Langchain?";

const result = await executor.call({ input });

console.log(`Got output ${result.output}`);
