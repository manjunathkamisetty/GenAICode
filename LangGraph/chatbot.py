# %% [markdown]
# ### Implementing simple Chatbot Using LangGraph

# %%
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END

## Reducers
from typing import Annotated
from langgraph.graph.message import add_messages

# %%
class State(TypedDict):
    messages:Annotated[list,add_messages]

# %%
import os
from dotenv import load_dotenv
load_dotenv()

os.environ["OPENAI_API_KEY"]=os.getenv("OPENAI_API_KEY")
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")


# %%
from langchain_openai import ChatOpenAI
llm=ChatOpenAI(model="gpt-4o")
llm.invoke("Hello")

# %%
from langchain_groq import ChatGroq

llm_groq=ChatGroq(model="qwen-qwq-32b")
llm_groq.invoke("Hey I am Krish and i like to play cricket")

# %% [markdown]
# ### We Will start With Creating Nodes

# %%
def superbot(state:State):
    return {"messages":[llm_groq.invoke(state['messages'])]}

# %%
graph=StateGraph(State)

## node
graph.add_node("SuperBot",superbot)
## Edges

graph.add_edge(START,"SuperBot")
graph.add_edge("SuperBot",END)


graph_builder=graph.compile()


## Display
from IPython.display import Image, display
display(Image(graph_builder.get_graph().draw_mermaid_png()))

# %%
## Invocation

graph_builder.invoke({'messages':"Hi,My name is Krish And I like cricket"})

# %% [markdown]
# #### Streaming The responses

# %%
for event in graph_builder.stream({"messages":"Hello My name is KRish"}):
    print(event)

# %%



