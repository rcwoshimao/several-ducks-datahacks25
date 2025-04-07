# Dathack 2025 Team Several Ducks - Tracktion/ How They Vibe
Measure the online reception to a new song by analyzing the sentiment using agentic AI conversations trained to simulate and reflect public online discourse.

## Inspiration

Nowadays, everyone is capable of contributing to pop culture--Whether it's through being an independent artist promoting their music on TikTok, someone posting their hot takes on Twitter, or a niche micro-influencer building a dedicated following. Social media has given everyone the opportunity to join the worldwide conversation.  

After the polarizing release of Playboi Carti's new album *MUSIC*, we were interested in creating a tool for artists to understand potential public reception **before** releasing their work. 

This tool would allow artists to gauge online response to new music, improve their marketing by showing them their potential audience, and avoid any PR blunders, especially in the era of cancel culture and hyper-critical online discourse.

## What it does

**Tracktion** allows an artist to upload an song of their choice. Our tool listens to the song and analyzes the semantics and motifs about the audio, and synthesizes it into text form. Then, we have a series of agentic AI chatbots to simulate online discourse about that song before it's released.

We then run sentiment analysis on these conversations to assess if the tone is positive, negative, or mixed overall. The result demonstrates potential public reception to the artist, giving artists early insight to how their work will be received.

This helps:
- **Independent artists** who may not have as many resources optimize their music to better suit public demand
- **Established artists** who want to avoid possible PR risks

## How we built it

- Webscraped 2,000+ YouTube clips from a public [dataset](https://www.kaggle.com/datasets/googleai/musiccaps?resource=download) and did transfer learning on a 286 million parameter multi-modal OpenAI audio analysis model called Whisper-small. 

- Utilized Gemini API to simulate tweets with prompt engineering. 

- Used a pre-trained [sentiment analysis model](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest) from HuggingFace trained on 124 million tweets from January 2018 to December 2021 to determine and visualize the overall trend in agentic responses to the audio file. 

## Challenges we ran into

- Lack of time to train our models

- Lack of access to good hardware

- Lack of experience with topics such as LLM training, prompt engineering, web development, and backend development

## Accomplishments that we're proud of

- Ethan: Proud of managing the sentiment analysis and writing functions to analyze overall trends in simulated tweets

- Kyle: Proud of building the agentic chatbots and model pre-processing for the audio analyzer

- Eric: Proud of model training, fine tuning, and working with sentiment analysis

- Rebecca: Proud of developing the front end of the project including animations and data visualizations 

## What we learned

We learned a lot throughout the development of this project including:

- How to work with **LLMs** to simulate dynamic and realistic conversation

- How to do **Transfer Learning** to refine existing LLMs

- Basic **Natural Language Processing** to interpret human language

- **Sentiment Analysis** to extract tone and opinion from text

- The power of a **Multi-Modal** approach when combining audio and text 


## What's next for Tracktion

1. Creating a better audio analysis model (more music, varied genres, labels). 
    - ensemble methods for audio analysis

2. Training with more parameters and context to better simulate conversations. 
    - incorporate more modern (<2 months) trends and terminology
    
3. Developing sentiment analysis to process more emotions than positive and negative.
    - improve existing integration with our website analytics
4. Fast delivered Frontend for presenting the product


## Team members 
- [Kyle Trinh](https://github.com/pink10000)
- [Eric Song](https://github.com/e7song) 
- [Rebecca Chen](https://github.com/rcwoshimao)
- [Ethan Earnn](https://github.com/earnn04) 

