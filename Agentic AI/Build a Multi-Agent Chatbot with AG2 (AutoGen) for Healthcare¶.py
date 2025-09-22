import warnings

# Suppress autogen and other deprecation/user warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings('ignore', category=UserWarning)

from autogen import ConversableAgent, GroupChat, GroupChatManager
from openai import OpenAI
import logging

# Suppress warnings from autogen.oai.client
logging.getLogger("autogen.oai.client").setLevel(logging.ERROR)


# Initialize OpenAI Client (API Key is automatically managed from environment variables or configured in OpenAI settings)
client = OpenAI()

# Disable Docker execution to prevent runtime errors
code_execution_config = {"use_docker": False}

# Sample LLM Configuration (Replace with actual API keys/config if needed)
llm_config = {"config_list": [{"model": "gpt-4", "api_key": None}]}  # Replace with real API key

#ConversableAgent
# Step 1: Create AI Agents with Defined Roles
patient_agent = ConversableAgent(
    name="patient", 
    system_message="You describe symptoms and ask for medical help.", 
    llm_config=llm_config
)

diagnosis_agent = ConversableAgent(
    name="diagnosis", 
    system_message="You analyze symptoms and provide a possible diagnosis. Summarize key points in one response.", 
    llm_config=llm_config
)

pharmacy_agent = ConversableAgent(
    name="pharmacy", 
    system_message="You recommend medications based on diagnosis. Only respond once.", 
    llm_config=llm_config
)

consultation_agent = ConversableAgent(
    name="consultation", 
    system_message="You determine if a doctor's visit is required. Provide a final summary with clear next steps. IMPORTANT: End your response with 'CONSULTATION_COMPLETE' to signal the end of the conversation.", 
    llm_config=llm_config
)

# Step 2: Create GroupChat for Structured Interaction
groupchat = GroupChat(
    agents=[diagnosis_agent, pharmacy_agent, consultation_agent],  # Patient only initiates
    messages=[], 
    max_round=5,  # Limits conversation to 5 rounds
    speaker_selection_method="round_robin"  # Ensures structured conversation flow
)

# Step 3: Create GroupChatManager to Handle Conversation
manager = GroupChatManager(name="manager", groupchat=groupchat)

# Step 4: Get Patient Input and Start Consultation
print("\n🤖 Welcome to the AI Healthcare Consultation System!")
symptoms = input("🩺 Please describe your symptoms: ")

print("\n🩺 Diagnosing symptoms...")
response = patient_agent.initiate_chat(
    manager, 
    message=f"I am feeling {symptoms}. Can you help?",
)

from autogen import ConversableAgent, GroupChat, GroupChatManager

# LLM Configuration (Replace None with actual API key if needed) 
llm_config = {"config_list": [{"model": "gpt-4o", "api_key": None}]}  # Provide OpenAI API key if required

# Create AI Agents with distinct roles 
patient_agent = ConversableAgent(
    name="patient",
    system_message="You describe your emotions and mental health concerns.",
    llm_config=llm_config
)

emotion_analysis_agent = ConversableAgent(
    name="emotion_analysis",
    system_message="You analyze the user's emotions based on their input."
                   "Do not provide treatment or self-care advice."
                   "Instead, just summarize the dominant emotions they may be experiencing.",
    llm_config=llm_config
)

therapy_recommendation_agent = ConversableAgent(
    name="therapy_recommendation",
    system_message="You suggest relaxation techniques and self-care methods"
                   "only based on the analysis from the Emotion Analysis Agent."
                   "Do not analyze emotions—just give recommendations based on the prior response.",
    llm_config=llm_config
)

# Create GroupChat for AI Agents 
groupchat = GroupChat(
    agents=[emotion_analysis_agent, therapy_recommendation_agent],
    messages=[], 
    max_round=3,  # Ensures the conversation does not stop too early 
    speaker_selection_method="round_robin"
)

# Create GroupChatManager 
manager = GroupChatManager(name="manager", groupchat=groupchat)

# Function to start the chatbot interaction 
def start_mental_health_chat():
    """Runs a chatbot for mental health support with distinct agent roles.""" 
    print("\nWelcome to the AI Mental Health Chatbot!") 
    user_feelings = input("How are you feeling today?")

    # Initiate conversation
    print("\nAnalyzing emotions...")
    response = patient_agent.initiate_chat(
        manager, 
        message=f"I have been feeling {user_feelings}. Can you help?"
    )

    # Ensure the therapy agent gets triggered
    if not response:  # If the initial response is empty, retry with explicit therapy agent prompt
        response = therapy_recommendation_agent.initiate_chat(
            manager, 
            message="Based on the user's emotions, please provide therapy recommendations."
        )

# Run the chatbot 
start_mental_health_chat()
