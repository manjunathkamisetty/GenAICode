from langgraph.graph import StateGraph

# IGNORE IF YOU ARE NOT RUNNING LOCALLY
from langchain_openai import ChatOpenAI
from langchain_ibm import ChatWatsonx
openai_llm = ChatOpenAI(
    model="gpt-4.1-nano",
    api_key = " you key",
)
watsonx_llm = ChatWatsonx(
    model_id="ibm/granite-3-2-8b-instruct",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="your project id associated with the API key",
    api_key="your watsonx.ai api key here",
)

from typing import TypedDict, Optional

class AuthState(TypedDict):
    username: Optional[str] 
    password: Optional[str]
    is_authenticated: Optional[bool]
    output: Optional[str]

# Example for AuthStage 

auth_state_1: AuthState = {
    "username": "alice123",
    "password": "123",
    "is_authenticated": True,
    "output": "Login successful."
}
print(f"auth_state_1: {auth_state_1}")

def input_node(state):
    print(state)
    if state.get('username', "") =="":
        state['username'] = input("What is your username?")

    password = input("Enter your password: ")

    return {"password":password}

def validate_credentials_node(state):
    # Extract username and password from the state
    username = state.get("username", "")
    password = state.get("password", "")

    print("Username :", username, "Password :", password)
    # Simulated credential validation
    if username == "test_user" and password == "secure_password":
        is_authenticated = True
    else:
        is_authenticated = False

    # Return the updated state with authentication result
    return {"is_authenticated": is_authenticated}

# Define the success node
def success_node(state):
    return {"output": "Authentication successful! Welcome."}

# Define the failure node
def failure_node(state):
    return {"output": "Not Successfull, please try again!"}

def router(state):
    if state['is_authenticated']:
        return "success_node"
    else:
        return "failure_node"
    
from langgraph.graph import StateGraph
from langgraph.graph import END

# Create an instance of StateGraph with the GraphState structure
workflow = StateGraph(AuthState)
workflow

workflow.add_node("InputNode", input_node)
workflow.add_node("ValidateCredential", validate_credentials_node)
workflow.add_node("Success", success_node)
workflow.add_node("Failure", failure_node)

workflow.add_edge("InputNode", "ValidateCredential")
workflow.add_edge("Success", END)
workflow.add_edge("Failure", "InputNode")

workflow.add_conditional_edges("ValidateCredential", router, {"success_node": "Success", "failure_node": "Failure"})

workflow.set_entry_point("InputNode")

app = workflow.compile()
inputs = {"username": "test_user"}
result = app.invoke(inputs)
print(result)

result['output']