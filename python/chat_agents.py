import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot
import seaborn as sns
import pandas as pd
from langchain_core.tools.base import InjectedToolCallId
from dotenv import load_dotenv
from langgraph.prebuilt import ToolNode, ToolExecutor
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import BaseMessage, SystemMessage, FunctionMessage, AIMessage, HumanMessage, ToolMessage
from typing_extensions import TypedDict, List, Literal, Annotated, Sequence, Any, Dict, Optional
from langgraph.types import Command
from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from langgraph.prebuilt import InjectedState
from langchain_core.tools import tool
import pandas as pd
import operator
from rich import print
import re
import matplotlib.pyplot as plt
from io import BytesIO, StringIO
import os
import google.generativeai as genai
# from data.synthetic_df import gen_synthetic_df
from data.dispatchers_data import create_data_prompt, load_dispatchers_data

load_dotenv(override=True)

# Configure the Gemini API
genai.configure(api_key="AIzaSyD-S0ajn_qCyVolBLg0mQ83j0ENoqznMX0")
llm_gemini = genai.GenerativeModel(model_name="gemini-2.0-flash-thinking-exp-01-21")
llm_groq = ChatGroq(model="llama-3.3-70b-versatile", api_key = "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")
llm_ollama = ChatOllama(model="granite3.1-dense:8b", temperature=0) #llama3.1:latest granite3.1-dense:8b qwen2.5-coder:14b  jacob-ebey/phi4-tools deepseek-r1:14b
# full_df = gen_synthetic_df()
full_df = load_dispatchers_data()

class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    query: str
    generated_code: str
    exec_result: Optional[Any] = None


def generate_python_function(state : AgentState):
    """
    Generate Python function code based on a natural language query about a DataFrame.
    """
    # sample_df = full_df.head().to_string()
    sample_df = create_data_prompt()
    query = state["query"]
    func_prompt = f"""You are an expert Python developer and data analyst. Based on the user's query and the provided DataFrame sample,
    generate Python function code to perform the requested analysis. Do not write doc strings of the function. Do not add any imports.

    User Query: {query}
    Sample DataFrame used only to infer the structure of the DataFrame:
    {sample_df}

    Please provide a Python function that takes a DataFrame as input and returns the result.
    Return only the Python function as a string and do not try to execute the code.
    Do not add sample dataframes, function descriptions and do not add calls to the function.
    When making calculations with floating points always make the results with max 2 decimal places.
    If possible provide your answers with the bulgarian names (cyrilic descriptions) in the dataframe attributes.

    If you need to return a pd.Series, please convert it to a pd.DataFrame. 
    Place the index in the first column and the other in the second one before returning it.

    IMPORTANT - For ANY visualization or plot:
    1. NEVER return the plot object directly
    2. ALWAYS convert the plot to a base64 string using this pattern:
       buf = io.BytesIO()
       [plot_object].fig.savefig(buf, format='png', bbox_inches='tight')
       buf.seek(0)
       image_base64 = base64.b64encode(buf.read()).decode('utf-8')
       buf.close()
       plt.close()
       return image_base64
    3. Always plot big size figures with high dpi.

    If you are using seaborn's jointplot or any other statistical plot that creates its own figure:
    1. Don't use plt.figure() before the plot
    2. Store the plot object (e.g. g = sns.jointplot(...))
    3. Use g.fig instead of plt when saving
    4. Add titles and labels using the plot object methods if needed (e.g. g.ax_joint.set_xlabel(...))
    """
    response = llm_gemini.generate_content(func_prompt)
    # print("1 - Generated Python Function Response:")
    # print(response.text)
    extracted_function = extract_function_code(response.text)
    state["generated_code"] = extracted_function
    return state # Return the updated state


def extract_function_code(generated_code: str) -> str:
    # print("Original code:")
    # print(generated_code)
    
    # First try to extract code from markdown code blocks
    code_block_match = re.search(r"```python\n(.*?)```", generated_code, re.DOTALL)
    if code_block_match:
        generated_code = code_block_match.group(1).strip()
        # print("\nExtracted from code block:")
        # print(generated_code)

    # Extract the function definition by finding the first occurrence of 'def '
    index = generated_code.find('def ')
    if index == -1:
        raise ValueError("Error: Could not extract a valid function definition from the generated code.")
    return generated_code[index:]


@tool
def execute_code_tool(generated_code: Annotated[str, InjectedState("generated_code")], tool_call_id: Annotated[str, InjectedToolCallId]) -> Any:
    """
    Executes dynamically generated Python code on a provided dataframe.

    Returns:
        Any: The result of executing the function, which must be a string, number, list or a pd.DataFrame.
    """
    function_body = generated_code
    print("3 - Executing Function Body:")
    print(function_body)
    namespace = {}
    exec("import pandas as pd\nimport matplotlib.pyplot as plt\nfrom io import BytesIO\nimport base64\nimport numpy as np\nimport seaborn as sns\nimport io\n", namespace)  # Import necessary modules
    exec(function_body, namespace)

    function_name = re.search(r"def\s+(\w+)\(", function_body).group(1)
    result = namespace[function_name](full_df)
    
    command = Command(
        update = {
            "messages" : [
                ToolMessage("Successfully executed the function.", tool_call_id = tool_call_id)
            ],
            "exec_result" : result
        }
    )
    return command


tools = [execute_code_tool]
tool_node = ToolNode(tools)
llm_tools = llm_groq.bind_tools(tools)


def call_model(state:AgentState):
    messages = state["messages"]  # Ensure system message is included
    response = llm_tools.invoke(messages)
    # print("Agent Response:", response)
    return {"messages": messages + [response]}

    return END
def router(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]

    if last_message.tool_calls:
        return "tools"
    return END

def run_graph(query: str):
    graph = StateGraph(AgentState)
    graph.add_node("generate_python_function", generate_python_function)
    graph.add_node("call_model", call_model)
    graph.add_node("tools", tool_node)

    graph.add_edge(START, "generate_python_function")
    graph.add_edge("generate_python_function", "call_model")
    graph.add_conditional_edges("call_model", router, {"tools": "tools", END: END})

    app = graph.compile()

    initial_state = AgentState(
        messages=[(SystemMessage(content=""" You have been provided with Python code in the 'generated_code' part of the state.
            Your ONLY task is to use the 'execute_code_tool' to execute this provided code."""))],
        query=query,
        generated_code="",
        exec_result=None
    )

    result = app.invoke(initial_state)
    exec_result = result["exec_result"]
    print("exec_result: ", exec_result)
    print("Type of exec_result: ", type(exec_result))
    return exec_result


