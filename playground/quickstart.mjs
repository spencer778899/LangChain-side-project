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
import { exec } from "child_process";

// ### Chain -> 我們必須定義整個 chain 的流程，套模板, search, llm...，定義所有使用的順序和模式
/*

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
const template = '你是一個 javascript 專家，請問 {problem}?';
const prompt = new PromptTemplate({
    template: template,
    inputVariables: ['problem']
})
// const formattedPromptTemplate = await prompt.format({
//     problem: '什麼是 Map'
// })

// LLM chain - 1. create prompt template 2. call to openai
const model = new OpenAI({temperature:0.9})
const chain = new LLMChain ({prompt: prompt,llm: model})
const resChain = await chain.call({
    problem: '什麼是 Map'
})

console.log(resChain)
*/

// ###Agent -> 我們只需要定義 task + tools + template，agent便會自動分析我們所需要的結果

// const agent = new OpenAI({
//     temperature:0,
//     modelName: 'text-davinci-003'
// })

// const tools = [
//     new SerpAPI(process.env.SERPAPI_API_KEY,{
//         location: "United States",
//         hl: 'en', 
//         gl: 'us', 
//     }),
//     new Calculator(),
// ]

// const executor = await initializeAgentExecutorWithOptions(tools,agent, {
//     agentType: 'zero-shot-react-description',
//     verbose: true,
//     maxIterations:5,
// })

// const result = await executor.call({input: 'what is LangChain'})

// console.log(result)

// ### Plan and Action Agent

// const tools = [
//     new SerpAPI(process.env.SERPAPI_API_KEY,{
//         location: "United States",
//         hl: 'en', 
//         gl: 'us', 
//     }),
//     new Calculator(),
// ]

// const chatMode = new ChatOpenAI({
//     temperature:0,
//     modelName: 'gpt-3.5-turbo',
//     verbose: true,
// })

// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//     llm: chatMode,
//     tools: tools
// })

// // We don;t tell it How to do it. We just Tell it what to do.
// const result = await executor.call({
//     input: "who is the Taiwan president now? what is their current age raised to the second power?"
// })

// console.log({result})

//### MEMORY

// const chatMode = new ChatOpenAI({
//     temperature:0,
//     modelName: 'gpt-3.5-turbo',
//     verbose: true,
// })

// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//     llm: chatMode,
//     tools: tools
// })

const llm = new OpenAI({})
const memory = new BufferMemory();
const conversationChain = new ConversationChain({ llm: llm, memory: memory});

const res1 = await conversationChain.call({
    input: 'My name is Spencer'
})

console.log(res1)
console.log(memory)

const res2 = await conversationChain.call({
    input: 'what is my name'
})

console.log(res2)
console.log(memory)