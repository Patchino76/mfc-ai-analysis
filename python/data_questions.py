import pandas as pd
import json
import google.generativeai as genai
from langchain_groq import ChatGroq
from langchain_core.messages import  HumanMessage
from data.dispatchers_data import create_data_prompt, load_dispatchers_data
from dotenv import load_dotenv
from rich import print
load_dotenv(override=True)

# Configure the Gemini API
genai.configure(api_key="AIzaSyD-S0ajn_qCyVolBLg0mQ83j0ENoqznMX0")
llm_gemini = genai.GenerativeModel(model_name="gemini-2.0-flash-thinking-exp-01-21")
llm_groq = ChatGroq(model="llama-3.2-90b-vision-preview", api_key = "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")

def parse_llm_response(response):
  """
  Parses the LLM response string to extract the JSON object.

  Args:
    response: The LLM response string.

  Returns:
    A Python list of dictionaries representing the JSON data, or None if parsing fails.
  """
  try:
    # Find the start and end of the JSON object
    start_index = response.find('[')
    end_index = response.rfind(']') + 1

    # Extract the JSON string
    json_string = response[start_index:end_index]

    # Parse the JSON string
    data = json.loads(json_string)
    return data
  except Exception as e:
    print(f"Error parsing JSON: {e}")
    return None

def get_df_questions(query : str, params : str = ""):
    df_sample = create_data_prompt()
    prompt = f"""You are an expert in data analysis and visualization. 
        Your task is to generate 10 specific analytical prompts based on a given analysis type, 
        a dataframe description, and optional parameters.

        **Analysis Type:**
        {query}

        **Dataframe Description:**
        {df_sample}

        **Optional Parameters (Dataframe Columns to emphasize):**
        {params}

        **Instructions:**
        1.  Understand the general analysis type provided in the `{query}` parameter.
        2.  Use the dataframe description in `{df_sample}` to understand the data structure and available columns.
        3.  If provided, emphasize the dataframe columns listed in the `{params}` parameter when generating analytical questions. 
            If the params is empty string, use all dataframe columns as parameters, but wisely choose which ones are appropriate to the main query '{query}'.
            If no params are provided, do not include the params keyword in the generated prompts.
            If params are provided, you can always add more columns that will complement the objective of the main query.
        4.  Generate 10 specific analytical prompts that are actionable and relevant to the given analysis type and dataframe.
        5.  Each prompt should be formulated to produce either a dataframe or a graph as a result.
        6.  For each prompt, specify:
            *   **id**: The number of the question (1 to 10).
            *   **type**:  Specify whether the expected result is a 'dataframe' or 'graph'.
            *   **content**:  The actual analytical question in Bulgarian, formulated to be clear and specific.
            *   **response**: Describe the expected output. If a dataframe, describe the columns and index. If a graph, describe the type of graph and the axes (columns used for X and Y axes, and any groupings or visual encodings).
            *   **goal**:  Briefly state the analytical goal of the question (what insight should be gained).
        7.  Output the 10 analytical prompts as a JSON array of objects, following the structure below:

        Example format:
        [
            {{
                "id": 1,
                "type": "dataframe" or "graph",
                "content": "...",
                "response": "...",
                "goal": "..."
            }}
        ]
        """

    response = llm_gemini.generate_content(prompt)
    response_json = parse_llm_response(response.text)
    print("LLM Response:")
    print(response_json)
    return response_json

# get_df_questions(query="Анализ на общия производствен обем с течение на времето:  Изследване на тенденцията на общото произведено количество през времето, за да се види динамиката на производството.", params="Суха преработена руда, Подадена руда от МГТЛ за денонощието")
def get_image_description(query: str, image_b64: str):
    df_structure = create_data_prompt()
    prompt = f"""
        Ти си експертен анализатор на данни и графики в минната и обогатителната индустрия.
        Имаш задълбочено разбиране за процеси като средно и ситно трошене на медна руда, смилане с топкови мелници и флотация.
        По-долу ти предоставям структурата на данните, която ще ти помогне да разкриеш контекста и спецификата на графиката:
        {df_structure}
        Графиката, която ще анализираш, е генерирана въз основа на следните въпроси:
        {query}
        Моля, дай анализ, като обръщаш специално внимание на значими тенденции, аномалии и критични показатели, които показват важната информация за процесите.
        Твоят анализ трябва да бъде кратък, ясен и насочен към подпомагане на екипите по поддръжка, технологите и мениджърите в предприятието за оптимизиране на производството.
        """
    llm_prompt = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_b64}"
                    }
                }
            ]
        }
    ]
    response = llm_groq.invoke(llm_prompt)
    print("Анализ на графиката:", response.content)
    return response.content
