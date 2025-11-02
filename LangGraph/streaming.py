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
from langgraph.checkpoint.memory import MemorySaver
memory=MemorySaver()
def superbot(state:State):
    return {"messages":[llm_groq.invoke(state['messages'])]}

# %%
graph=StateGraph(State)

## node
graph.add_node("SuperBot",superbot)
## Edges

graph.add_edge(START,"SuperBot")
graph.add_edge("SuperBot",END)


graph_builder=graph.compile(checkpointer=memory)


## Display
from IPython.display import Image, display
display(Image(graph_builder.get_graph().draw_mermaid_png()))

# %%
## Invocation

config = {"configurable": {"thread_id": "1"}}

graph_builder.invoke({'messages':"Hi,My name is Krish And I like cricket"},config)

# %% [markdown]
# ### Streaming 
# Methods: .stream() and astream()
# 
# - These methods are sync and async methods for streaming back results.
# 
# Additional parameters in streaming modes for graph state
# 
# - **values** : This streams the full state of the graph after each node is called.
# - **updates** : This streams updates to the state of the graph after each node is called.
# 
# ![image.png](attachment:image.png)

# %% [markdown]
# #### Streaming The Responses With Stream Method

# %%
# Create a thread
config = {"configurable": {"thread_id": "3"}}

for chunk in graph_builder.stream({'messages':"Hi,My name is Krish And I like cricket"},config,stream_mode="updates"):
    print(chunk)

# %%
for chunk in graph_builder.stream({'messages':"I also like football"},config,stream_mode="values"):
    print(chunk)

# %%
for chunk in graph_builder.stream({'messages':"I also like football "},config,stream_mode="updates"):
    print(chunk)

# %%
for chunk in graph_builder.stream({'messages':"I Love sports "},config,stream_mode="values"):
    print(chunk)

# %% [markdown]
# #### Streaming The Responses With astream Method
# 
# **Streaming tokens**
# We often want to stream more than graph state.
# 
# In particular, with chat model calls it is common to stream the **tokens** as they are generated.
# 
# We can do this using the .astream_events method, which streams back events as they happen inside nodes!
# 
# Each event is a dict with a few keys:
# 
# - event: This is the type of event that is being emitted.
# - name: This is the name of event.
# - data: This is the data associated with the event.
# - metadata: Containslanggraph_node, the node emitting the event.

# %%
config = {"configurable": {"thread_id": "3"}}

async for event in graph_builder.astream_events({"messages":["Hi My name is Krish and I like to play cricket"]},config,version="v2"):
    print(event)

# %%



