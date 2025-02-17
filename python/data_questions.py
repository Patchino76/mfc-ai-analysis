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
    prompt = f"""Вие сте експерт в областта на анализа на данни и визуализацията. Вашата задача е да генерирате 10 практически аналитични запитвания, базирани на посочения основен тип анализ, описание на dataframe и допълнителни параметри (опционално, конкретни колони от dataframe).

        Основен тип анализ: {query}
        Описание на dataframe: {df_sample}
        Допълнителни параметри (колони за акцентиране): {params}

        Инструкции:
        1. Интерпретирайте основния тип анализ, посочен в {query}.
        2. Прегледайте описанието на dataframe {df_sample}, за да разберете неговата структура и наличните колони.
        3. Ако {params} не е празно, генерирайте запитвания, използвайки само посочените колони. Ако {params} е празно, генерирайте общи запитвания без препратки към конкретни колони.
        4. Обърнете внимание, че анализите са предназначени за мениджъри в индустрията за рудно добиване, занимаващи се с оптимизиране на процеси като раздробяване и флотация на мед.
        5. Създайте 10 аналитични запитвания, които могат да доведат до генериране на dataframe или графика. Всяко запитване трябва да насочва към постигане на целта от анализа {query}.
        6. Всеки резултат трябва да включва следните ключове:
            - "type": "dataframe" или "graph" в зависимост от очаквания резултат.
            - "content": ясна аналитична запитване на български език.
            - "response": описание на очаквания изход (ако е dataframe, посочете колони и индекси; ако е графика, посочете вид на графиката, информация за осите и необходимите групирания).
            - "goal": кратко описание на целта или инсайта, който трябва да се постигне.
        
        Върнете резултатите като JSON масив от обекти с горепосочената структура.
        Примерен изход: [ {{"type": "dataframe", "content": "...", "response": "...", "goal": "..." }}, ... ] """

    response = llm_gemini.generate_content(prompt)
    response_json = parse_llm_response(response.text)
    print("LLM Response:")
    print(response_json)
    return response_json

# get_df_questions(query="Анализ на общия производствен обем с течение на времето:  Изследване на тенденцията на общото произведено количество през времето, за да се види динамиката на производството.", params="Суха преработена руда, Подадена руда от МГТЛ за денонощието")
def get_image_analysis(query: str, image_b64: str):
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
    #groq
    # response = llm_groq.invoke(llm_prompt)
    # print("Анализ на графиката:", response.content)
    # return response.content

    #gemini
    response = llm_gemini.generate_content(prompt)
    # print("Анализ на графиката:", response.text)
    return response.text

def get_df_analysis(query: str, df_result: str):
    df_structure = create_data_prompt()
    prompt = f"""
    Ти си експертен анализатор на данни в минната и обогатителната индустрия. 
    Твоята задача е да анализираш резултатната таблица, получена от анализ на по-голям набор от данни, чиито детайли са описани по-долу.
    
    Анализирай следната таблица, получена от въпроса:
    {query}
    
    Таблица:
    {df_result}
    
    Структура на данните:
    {df_structure}
    
    Дай кратък и ясен анализ, като обръщаш специално внимание на значими тенденции, аномалии и критични показатели, които показват важната информация за процесите.
    """
    
    response = llm_gemini.generate_content(prompt)
    print("Анализ на таблицата:", response.text)
    return response.text

def get_combined_analysis(current_query: str, current_processed_results: list):
    df_structure = create_data_prompt()
    
    # Initialize prompt content
    prompt = f"""
        Ти си експертен анализатор на данни и графики в минната и обогатителната индустрия.
        Имаш задълбочено разбиране за процеси като средно и ситно трошене на медна руда, смилане с топкови мелници и флотация.
        
        По-долу ти предоставям структурата на данните, която ще ти помогне да разкриеш контекста и спецификата на анализа:
        {df_structure}
        
        Анализът е генериран въз основа на следния въпрос:
        {current_query}
        
        Ще ти предоставя няколко елемента за анализ:
    """
    
    # Track what types of data we have for better prompt construction
    has_dataframes = False
    has_graphs = False
    
    # Process each result
    for idx, result in enumerate(current_processed_results):
        if "dataframe" in result:
            has_dataframes = True
            df_data = result["dataframe"]
            prompt += f"\n\nТаблица {idx + 1}:"
            # Convert dataframe to string representation for the prompt
            df_str = "\n".join([f"- " + ", ".join([f"{k}: {v}" for k, v in row.items()]) for row in df_data[:5]])
            prompt += f"\n{df_str}"
            if len(df_data) > 5:
                prompt += "\n(показани са първите 5 реда от данните)"
                
        elif "graph" in result and result["graph"]:
            has_graphs = True
            prompt += f"\n\nГрафика {idx + 1}: Визуализация на данните"
    
    # Add final analysis instructions based on what we have
    prompt += "\n\nМоля, направи кратък анализ, като исползваш българските наименования на параметрите:"
    if has_dataframes and has_graphs:
        prompt += """
        - Обедини информацията от таблиците и графиките в общ анализ
        - Открий връзките между числовите данни и визуалните тенденции
        - Посочи важни зависимости, които се виждат едновременно в данните и графиките"""
    elif has_dataframes:
        prompt += """
        - Анализирай числовите стойности и тенденции в данните
        - Открий важни зависимости между различните показатели
        - Посочи критични стойности или аномалии"""
    elif has_graphs:
        prompt += """
        - Анализирай визуалните тенденции в графиките
        - Открий важни моменти и промени в показателите
        - Посочи критични точки или аномалии"""
    
    prompt += """
        
        Твоят анализ трябва да бъде кратък, ясен и насочен към подпомагане на екипите по поддръжка, технологите и мениджърите в предприятието за оптимизиране на производството.
        """
    
    # Prepare content parts for Gemini
    content_parts = [{"text": prompt}]
    
    # Add images if we have graphs
    for result in current_processed_results:
        if "graph" in result and result["graph"]:
            content_parts.append({
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": result["graph"]
                }
            })
    
    # Generate content with Gemini
    response = llm_gemini.generate_content(content_parts)
    return response.text
