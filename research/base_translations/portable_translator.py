## Portable script made to run on other machines, since google capped my IP

import pandas as pd

questions = pd.read_csv("questions.csv")


lang_list = ['gu','hi','kn','mr','te','ta','bn']

for lang in lang_list:
    print(lang)
    temp = questions.copy()
    temp['translated_question'] = [ques.text for ques in translator.translate(list(temp['question']), src='en', dest=lang)]
    temp['translated_options'] = temp['options'].apply(lambda x: [op.text for op in translator.translate(x.split(","), src='en', dest=lang)])
    temp = temp[['tag','type','question','translated_question','options','translated_options']]
    temp.to_csv(lang+"_questions.csv", index=False)