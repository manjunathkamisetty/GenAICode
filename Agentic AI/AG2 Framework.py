# Import necessary modules
import os
from dotenv import load_dotenv
from autogen import ConversableAgent, AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from autogen.llm_config import LLMConfig
import json
import time
import random

# Load environment variables
load_dotenv()

print("AG2 modules imported successfully!")

import logging

# Suppress API key format warning
logging.getLogger("autogen.oai.client").setLevel(logging.ERROR)

# # Create a configuration file for your API keys
# # Replace with your actual API key
# config_list = [
#     {
#         "model": "gpt-4",
#         #"api_key": ""
#     }
# ]

# Alternatively, you can create a JSON file
# '''
# with open('config.json', 'w') as f:
#    json.dump(config_list, f)
    
# Then load it
# config_list = config_list_from_json("config.json")
# '''

# simple Conversable agent 

from autogen import ConversableAgent, LLMConfig

# Step 1: Define the LLM configuration
llm_config = LLMConfig(api_type="openai", model="gpt-4o-mini")

# Step 2: Define our two agents — a student and a tutor
with llm_config:
    # Create the student agent (asks questions)
    student = ConversableAgent(
        name="student",
        system_message="You are a curious student. You ask clear, specific questions to learn new concepts.",
        human_input_mode="NEVER"  # disables manual input during chat
    )

    # Create the tutor agent (responds with beginner-friendly answers)
    tutor = ConversableAgent(
        name="tutor",
        system_message="You are a helpful tutor who provides clear and concise explanations suitable for a beginner.",
        human_input_mode="NEVER"
    )

# Step 3: Start a 2-turn conversation initiated by the student
chat_result = student.initiate_chat(
    recipient=tutor,                                # who the student is talking to
    message="Can you explain what a neural network is?",  # the student's question
    max_turns=2,                                     # total number of back-and-forth messages
    summary_method="reflection_with_llm"            # generate a final summary using LLM
)

# Step 4: Print the summary of the conversation
print("\nFinal Summary:")
print(chat_result.summary)

#Creating Specialized Agents

# Create a Technical Expert Agent
tech_expert = ConversableAgent(
    name="tech_expert",
    system_message="""You are a senior software engineer with expertise in Python, AI, and system design.
    Provide technical, detailed explanations with code examples when appropriate.
    Always consider best practices and performance implications.""",
    llm_config=llm_config,
    human_input_mode="NEVER"
)

# Create a Creative Writer Agent
creative_writer = ConversableAgent(
    name="creative_writer",
    system_message="""You are a creative writer and storyteller.
    Your responses are engaging, imaginative, and use vivid descriptions.
    You excel at making complex topics accessible through stories and analogies.""",
    llm_config=llm_config,
    human_input_mode="NEVER"
)

# Create a Business Analyst Agent
business_analyst = ConversableAgent(
    name="business_analyst",
    system_message="""You are a business analyst focused on ROI, efficiency, and strategic planning.
    Always consider business impact, costs, and practical implementation.
    Provide actionable recommendations with clear metrics.""",
    llm_config=llm_config,
    human_input_mode="NEVER"
)

agents = [tech_expert, creative_writer, business_analyst]
print("Specialized agents created!")
for agent in agents:
    print(f"- {agent.name}: {agent.system_message.split('.')[0]}.")

# %% Built-in Agent types
# Requirements:
# !pip install matplotlib numpy  # first run without installing the libraries and see if the agent installs the required libraries itself.

from autogen import AssistantAgent, UserProxyAgent, LLMConfig
from autogen.coding import LocalCommandLineCodeExecutor

# Step 1: Configure the LLM to use (e.g., GPT-4o Mini via OpenAI)
llm_config = LLMConfig(api_type="openai", model="gpt-4o-mini")

# Step 2: Create the assistant agent (code-writing AI)
with llm_config:
    assistant = AssistantAgent(
        name="assistant",
        system_message="You are a helpful assistant who writes and explains Python code clearly."
    )

# Step 3: Create the user agent that can execute code
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",  # Automatically executes code without human input
    max_consecutive_auto_reply=5,  # Ends after 5 response cycles (assistant + user_proxy turns)
    code_execution_config={
        "executor": LocalCommandLineCodeExecutor(work_dir="coding", timeout=30),
    },
)

# Step 4: Start a simple task that leads to code generation and execution
chat_result = user_proxy.initiate_chat(
    recipient=assistant,
    message="""Plot a sine wave using matplotlib from -2π to 2π and save the plot as sine_wave.png.""",
    max_turns=4,  # 2 rounds of assistant ↔ user_proxy
    summary_method="reflection_with_llm"  # Optional: final LLM-generated summary
)

# Step 5: Display the generated figure (optional for notebook environments)
from IPython.display import Image, display
import os

image_path = "coding/sine_wave.png"
if os.path.exists(image_path):
    display(Image(filename=image_path))
else:
    print("Plot not found. Please check if the assistant saved the file correctly.")

# Step 6: Print summary
print("\n Final Summary:")
print(chat_result.summary)

#human in loop agent 
from autogen import ConversableAgent, LLMConfig
import os
import random


# Step 1: Configure the LLM to use (e.g., GPT-4o Mini via OpenAI)
llm_config = LLMConfig(api_type="openai", model="gpt-4o-mini")

# Step 2: Define system message for bug triage assistant
triage_system_message = """
You are a bug triage assistant. You will be given bug report summaries.

For each bug:
- If it is urgent (e.g., 'crash', 'security', or 'data loss' is mentioned), escalate it and ask the human agent for confirmation.
- If it seems minor (e.g., cosmetic, typo), suggest closing it but still ask for human review.
- Otherwise, classify it as medium priority and ask the human for review.

Once all bugs are processed, summarize what was escalated, closed, or marked as medium priority.
End by saying: "You can type exit to finish."
"""

# Step 3: Create the assistant agent
with llm_config:
    triage_bot = ConversableAgent(
        name="triage_bot",
        system_message=triage_system_message,
    )

# Step 4: Create the human agent who will review each recommendation
human = ConversableAgent(
    name="human",
    human_input_mode="ALWAYS",  # prompts for input at each step
)

# Step 5: Generate sample bug reports
BUGS = [
    "App crashes when opening user profile.",
    "Minor UI misalignment on settings page.",
    "Password reset email not sent consistently.",
    "Typo in the About Us footer text.",
    "Database connection timeout under heavy load.",
    "Login form allows SQL injection attack.",
]

random.shuffle(BUGS)
selected_bugs = BUGS[:3]

# Format the initial task
initial_prompt = (
    "Please triage the following bug reports one by one:\n\n" +
    "\n".join([f"{i+1}. {bug}" for i, bug in enumerate(selected_bugs)])
)

# Step 6: Start the conversation
response = human.run(
    recipient=triage_bot,
    message=initial_prompt,
)

# Step 7: Display the response
response.process()

#Agent Orchestraion 
from autogen import ConversableAgent, GroupChat, GroupChatManager, LLMConfig

# Replace "PLACEHOLDER" with your actual OpenAI API key if running locally
llm_config = LLMConfig(api_type="openai", model="gpt-4o-mini", )  # add api_key="PLACE_HOLDER" Replace with your API key to run outside this learning environment

# Define system messages and agent descriptions
planner_message = "Create a short lesson plan for 4th graders."
reviewer_message = "Review a plan and suggest up to 3 brief edits."
teacher_message = "Suggest a topic and reply DONE when satisfied."

with llm_config:
    lesson_planner = ConversableAgent(
        name="planner_agent",
        system_message=planner_message,
        description="Makes lesson plans.",
    )

    lesson_reviewer = ConversableAgent(
        name="reviewer_agent",
        system_message=reviewer_message,
        description="Reviews lesson plans and suggests edits.",
    )

    teacher = ConversableAgent(
        name="teacher_agent",
        system_message=teacher_message,
        is_termination_msg=lambda x: "DONE" in (x.get("content", "") or "").upper()
    )

# Configure the group chat with automatic speaker selection
groupchat = GroupChat(
    agents=[teacher, lesson_planner, lesson_reviewer],
    speaker_selection_method="auto"  # Uses AutoPattern
)

manager = GroupChatManager(
    name="group_manager",
    groupchat=groupchat,
    llm_config=llm_config
)

# Start with a short initial prompt to keep tokens low
teacher.initiate_chat(
    recipient=manager,
    message="Make a simple lesson about the moon.",
    max_turns=6,  # Limit total rounds (e.g., 2 per agent max) -  As a safeguard, it's always best to use max_turns to prevent runaway loops.
    summary_method="reflection_with_llm"
)


#tools and extensions 
from autogen import ConversableAgent, register_function, LLMConfig
from typing import Annotated

# Replace with your actual key if running outside this environment
llm_config = LLMConfig(api_type="openai", model="gpt-4o-mini")

# Define a simple utility function to check if a number is prime
def is_prime(n: Annotated[int, "Positive integer"]) -> str:
    if n < 2:
        return "No"
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return "No"
    return "Yes"

# Create the asking agent and the tool-using agent
with llm_config:
    math_asker = ConversableAgent(
        name="math_asker",
        system_message="Ask whether a number is prime."
    )
    math_checker = ConversableAgent(
        name="math_checker",
        human_input_mode="NEVER"
    )

# Register the function between the two agents
register_function(
    is_prime,
    caller=math_asker,
    executor=math_checker,
    description="Check if a number is prime. Returns Yes or No."
)

# Start a brief conversation
math_checker.initiate_chat(
    recipient=math_asker,
    message="Is 72 a prime number?",
    max_turns=2
)

#structured o/p with Pydantic

from pydantic import BaseModel
from autogen import ConversableAgent, LLMConfig

# Define the structure of the agent's output
class TicketSummary(BaseModel):
    customer_name: str
    issue_type: str
    urgency_level: str
    recommended_action: str

# Configure the LLM with the structured output format
llm_config = LLMConfig(
    api_type="openai",
    model="gpt-4o-mini",
    response_format=TicketSummary,
)

# Create the agent
with llm_config:
    support_agent = ConversableAgent(
        name="support_agent",
        system_message=(
            "You are a support assistant. Summarize a customer ticket using:"
            "\n- customer_name"
            "\n- issue_type (e.g. login issue, billing problem, bug report)"
            "\n- urgency_level (Low, Medium, High)"
            "\n- recommended_action"
        ),
    )

# Start a structured conversation
support_agent.initiate_chat(
    recipient=support_agent,
    message="Ticket: John Doe is unable to reset his password and has an important meeting in 30 minutes.",
    max_turns=1
)

