#%%
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import base64
import seaborn as sns
from io import BytesIO, StringIO
import io
#%%
def gen_synthetic_df():
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 1, 10)
    categories = ["механо", "електро", "технологични", "ппр", "системни"]
    streams = [f"Поток {i}" for i in range(1, 14)]
    machines = ["Питател 1", "Питател 2", "Питател 3", "Питател 4", "Питател 5", "Питател 6", "Дълга лента", "Горно сито", "Къса лента", "Течка", "Трошачка", "Долно сито", "Маслена станция", "ССТ 5", "ПВ 1", "ПВ 2/3", "ССТ 7", "ССТ 8", "ССТ 9", "МБ 1", "МБ 2"]

    # Generate random data
    data = []
    for _ in range(1000):
        start_time = start_date + timedelta(minutes=random.randint(0, int((end_date - start_date).total_seconds() / 60)))
        duration = np.random.poisson(lam=20) + 5  # Poisson distribution with lambda=60, shifted by 5 minutes
        duration = min(max(duration, 5), 180)  # Ensure duration is within the range 5 to 180 minutes
        end_time = start_time + timedelta(minutes=duration)
        category = random.choice(categories)
        stream_name = random.choice(streams)
        machine_name = random.choice(machines)
        data.append([start_time, end_time, duration, category, stream_name, machine_name])

    # Create the dataframe
    df = pd.DataFrame(data, columns=["start_time", "end_time", "duration_minutes", "category", "stream_name", "machine_name"])
    return df   

#%%

# df = gen_synthetic_df().head()
# print(df)

# def calculate_average_duration_by_category(df: pd.DataFrame) -> pd.DataFrame:
#     average_duration_by_category = df.groupby('category')['duration_minutes'].mean().reset_index()       
#     return average_duration_by_category


# average_duration_by_category = calculate_average_duration_by_category(df)
# print(average_duration_by_category)
# #%%
# df = gen_synthetic_df().head()
# def plot_function(df):
#     df_bg = df.rename(columns={
#         'start_time': 'Начален час',
#         'end_time': 'Краен час',
#         'duration_minutes': 'Продължителност (минути)',
#         'category': 'Категория',
#         'stream_name': 'Име на поток',
#         'machine_name': 'Име на машина'
#     })
#     filtered_df = df_bg[df_bg['Име на поток'].isin(['Поток 5', 'Поток 7'])]
#     plt.figure(figsize=(10, 6))
#     sns.regplot(x='Категория', y='Продължителност (минути)', data=filtered_df)
#     plt.title('Диаграма на разсейване с регресионна права на престоите')
#     plt.xlabel('Категория')
#     plt.ylabel('Продължителност (минути)')
#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
#     plt.close()
#     return image_base64
# rez = plot_function(df)
# print(rez)
# # %%
# df = gen_synthetic_df()
# def generate_scatter_plot_with_regression(df):
#     import pandas as pd
#     import seaborn as sns
#     import matplotlib.pyplot as plt
#     import io
#     import base64

#     df_filtered = df[df['stream_name'].isin(['Поток 5', 'Поток 7'])].copy()

#     plt.figure(figsize=(10, 6))
#     sns.regplot(data=df_filtered, x='category', y='duration_minutes', x_estimator=None)

#     plt.xlabel('Категория')
#     plt.ylabel('Продължителност (минути)')
#     plt.title('Диаграма на разсейване с регресионна права на престоите по категории за Поток 5 и Поток 7')

#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     image_png = buffer.getvalue()
#     buffer.close()

#     graphic = base64.b64encode(image_png)
#     graphic_str = graphic.decode('utf-8')

#     plt.close()
#     return graphic_str

# rez = generate_scatter_plot_with_regression(df)
# print(rez)
# %%
