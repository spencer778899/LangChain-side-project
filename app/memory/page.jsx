"use client"
import React, { useState } from "react";
import "../globals.css"
import Title from "../components/Title"
import TwoColumnLayout from "../components/TwoColumnLayout";
import PageHeader from "../components/PageHeader";
import ResultWithSources from "../components/ResultWithSources";
import PromptBox from "../components/PromptBox";

const Memory = () => {
    const [prompt,setPrompt] = useState("")
    const [error, setError] = useState(null)
    const [messages, setMessages] = useState([
        {
            text: "Hi there! What's your name and favourite food?",
            type: "bot",        
        }
    ])
    const [firstMsg,setFirstMsg] = useState(true);

    const handlePromptChange = (e) =>{
        setPrompt(e.target.value)
    }
    const handleSubmitPrompt = async () => {
        console.log("test",prompt)
        try{
            setMessages((prevMessages) => [
                ...prevMessages,
                {text: prompt, type:"user",sourceDocuments:null}
        ])
            const response = await fetch("/api/memory",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({input: prompt, firstMsg})
            })
            if (!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }

            
            setPrompt("")
            setFirstMsg(false)

            const searchRes = await response.json()
            setMessages((prevMessages) => [
                ...prevMessages,
                {text: searchRes.output.response, type:"bot",sourceDocuments:null}
            ])
            
            console.log({searchRes})
        }catch(err){
            console.Console.error(err);
            setError(err)
        }
    }
    return (
        <>
        <Title headingText={"Memory"} emoji="🧠" />
        <TwoColumnLayout
          leftChildren={
            <>
              <PageHeader
                heading="I remember everything"
                boldText="Let's see if it can remember your name and favourite food. This tool will let you ask anything contained in a PDF document. "
                description="This tool uses Buffer Memory and Conversation Chain.  Head over to Module X to get started!"
              />
            </>
          }
          rightChildren={
            <>
              <ResultWithSources messages={messages} pngFile="brain" />
              <PromptBox
                prompt={prompt}
                handleSubmit={handleSubmitPrompt}
                handlePromptChange={handlePromptChange}
                error={error}
                pngFile=""
              />
            </>
          }
        />
      </>
    )
}

export default Memory;