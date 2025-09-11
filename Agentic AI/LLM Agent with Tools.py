from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage

from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai")

# IGNORE IF YOU ARE NOT RUNNING LOCALLY
from langchain_openai import ChatOpenAI
from langchain_ibm import ChatWatsonx
openai_llm = ChatOpenAI(
    model="gpt-4.1-nano",
    api_key = "your openai api key here",
)
watsonx_llm = ChatWatsonx(
    model_id="ibm/granite-3-2-8b-instruct",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="your project id associated with the API key",
    api_key="your watsonx.ai api key here",
)

@tool
def add(a: int, b: int) -> int:
    """
    Add a and b.
    
    Args:
        a (int): first integer to be added
        b (int): second integer to be added

    Return:
        int: sum of a and b
    """
    return a + b

tools = [add]


@tool
def subtract(a: int, b:int) -> int:
    """Subtract b from a."""
    return a - b

@tool
def multiply(a: int, b:int) -> int:
    """Multiply a and b."""
    return a * b

tools = [add, subtract, multiply]

llm_with_tools = llm.bind_tools(tools)
tool_map = {
    "add": add, 
    "subtract": subtract,
    "multiply": multiply
}

input_ = {
    "a": 1,
    "b": 2
}

tool_map["add"].invoke(input_)

query = "What is 3 + 2?"
chat_history = [HumanMessage(content=query)]

response_1 = llm_with_tools.invoke(chat_history)
chat_history.append(response_1)

print(type(response_1))
#print(response_1)
tool_response = tool_map[tool_1_name].invoke(tool_1_args)
tool_message = ToolMessage(content=tool_response, tool_call_id=tool_call_1_id)

print(tool_message)
chat_history.append(tool_message)

answer = llm_with_tools.invoke(chat_history)
print(type(answer))
print(answer.content)

tool_calls_1 = response_1.tool_calls

tool_1_name = tool_calls_1[0]["name"]
tool_1_args = tool_calls_1[0]["args"]
tool_call_1_id = tool_calls_1[0]["id"]

print(f'tool name:\n{tool_1_name}')
print(f'tool args:\n{tool_1_args}')
print(f'tool call ID:\n{tool_call_1_id}')

#building an agent y_agent = ToolCallingAgent(llm)

print(my_agent.run("one plus 2"))

print(my_agent.run("one - 2"))

print(my_agent.run("three times two"))
class ToolCallingAgent:
    def __init__(self, llm):
        self.llm_with_tools = llm.bind_tools(tools)
        self.tool_map = tool_map

    def run(self, query: str) -> str:
        # Step 1: Initial user message
        chat_history = [HumanMessage(content=query)]

        # Step 2: LLM chooses tool
        response = self.llm_with_tools.invoke(chat_history)
        if not response.tool_calls:
            return response.contet # Direct response, no tool needed
        # Step 3: Handle first tool call
        tool_call = response.tool_calls[0]
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_call_id = tool_call["id"]

        # Step 4: Call tool manually
        tool_result = self.tool_map[tool_name].invoke(tool_args)

        # Step 5: Send result back to LLM
        tool_message = ToolMessage(content=str(tool_result), tool_call_id=tool_call_id)
        chat_history.extend([response, tool_message])

        # Step 6: Final LLM result
        final_response = self.llm_with_tools.invoke(chat_history)
        return final_response.content

my_agent = ToolCallingAgent(llm)

print(my_agent.run("one plus 2"))

print(my_agent.run("one - 2"))

print(my_agent.run("three times two"))