## Inspiration

Nowadays everyone has the capability of contributing to pop culture. Whether it's through being an independent artist promoting their music on TikTok, someone posting their hot takes on Twitter, or a niche micro-influencer building a dedicated following, social media has given everyone the opportunity to contribute to the worldwide conevrsation.  

After the polarizing release of Playboi Carti's new album *MUSIC*, we were interested in creating a tool for artists to understand public receptioin **before** releasing their work. 

This tool would allow artists to gauge the online response to new music, helping improve the marketing of smaller artists allowing them to create more popular music, while also helping larger artists who may want to avoid any PR blunders, especially in the era of cancel culture and hyper-critical online discourse.

## What it does

Discourse Simulator allows an artist to upload a .mp3 file of their new song.  Our tool then listens to the song, and uses agentic AI chatbots to simulate online discourse about a song before it's released.

We then run sentiment analysis on these conversations to see if the tone is overall positive, negative, or mixed. The result demonstrates potential public reception to the artist, giving artists early insight to how their work will be received.

This helps:
    - **Independent artists** who may not have as many resources optimize their music to better suit public demand
    - **Established artists** who want to avoid possible PR risks

## How we built it

Webscraped 2,000 YouTube clips from a public [kaggle dataset](https://www.kaggle.com/datasets/googleai/musiccaps?resource=download) and did transfer learning on a 286 million parameter multi-modal OpenAI audio analysis model called Whisper-small. 

Utilized Gemini API to simulate tweets with prompt engineering. 

Used a pre-trained [sentiment analysis model](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest) from HuggingFace trained on 124 million tweets from January 2018 to December 2021 to determine and visualize the overall trend in responses to the audio file. 

## Challenges we ran into

- Lack of time

- Lack of good hardware

- Lack of funding to utilize good hardware

## Accomplishments that we're proud of

- Ethan: Proud of managing the sentiment analysis and writing functions to analyze overall trends in simulated tweets

- Kyle: Proud of building the Discourse Simulator and model pre-processing

- Eric: Proud of model training, fine tuning, and working with sentiment analysis

- Rebecca: Proud of

## What we learned

We learned a lot throughout the development of this project including:

    - How to work with **LLMs** to simulate dynamic and realistic conversation

    - Basic **Natural Langauge Processing** to interpret human language

    - **Sentiment Analysis** to extract tone and opinion from text

    - The power of a **multi-modal** approach when combining audio and text 


## What's next for Discourse Simulator

Creating a better audio analysis model (more music, varied genres, labels). Training on a better more accurate dataset to to better simulate conversation. Developing sentiment analysis to process more emotions than positive and negative.