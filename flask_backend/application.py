import os
from flask import Flask
import flask
from flask_cors import CORS
from pymongo import MongoClient

# You need to set MongoDB connection strings as environment variables before proceeding
client = MongoClient(os.getenv("MONGOURL"))
db = client.corona    #Select the database
db.authenticate(name=os.getenv("MONGO_USERNAME"),password=os.getenv("MONGO_PASSWORD"))

# Risk mapping
# Note - This risk rating mapping was developend in consulation with doctors by referring the literature and case studies documented by WHO
# The scientific validity of this procedure is yet to be validated
risk_score = {'0-10': 1, '60-70': 2, '70-100': 3, 'No fever (96°F-98.6°F)': 0, 'Minor fever (98.6°F-102°F)': 2, 'High fever (>102°F)': 5, 'Don’t know': 0, 'Running nose': 1, 'Cough': 5, 'Sore throat': 3, 'Sneezing': 1, 'Shortness of breath': 5, 'Difficulty in breathing': 5, 'Continuous pain in the chest': 5, 'Hypertension(BP)': 1, 'Diabetes': 1, 'Asthma': 2, 'Heart disease': 2, 'Kidney disease': 1, 'None of these': 0, 'Health worsened': 2, 'No change in health': 1, '10-20': 1, '20-50': 2, 'More than 50': 3, 'Vomiting': 2, 'Blood vomiting': 5, 'Diarrhea': 2, 'Weakness': 3, 'Chemotherapy': 2, 'Radiotherapy': 2, 'TB': 3, 'Pneumonia': 3, 'Organ transplant': 2, 'Low immunity': 2, 'Medium immunity': 1, 'Good immunity': 0, 'Body pain': 3}

userdata = db.userdata
visits = db.visits
messages = db.messages

app = Flask(__name__)
# For cross origin requests
CORS(app)

# Fancy way to check the service status and spook intruders
@app.route("/")
def hello():
    return "Proceed with caution. Your actions will be noted."

# Prediction API endpoint
@app.route("/predict", methods=["POST"])
def predict():
	req_json = flask.request.json
	print('Request JSON', req_json)
	
	score_log = {}
	raw_score = 0
	clean_score = 0

	# Quick and dirty way to check symptoms and add risk points
	for key, value in req_json['answers'].items():
	    if isinstance(value, list):
	        local_score = 0
	        for sub_value in value:
	            if(sub_value in risk_score.keys()):
	                local_score += risk_score[sub_value]
	                raw_score += risk_score[sub_value]
			# Capping risk score
	        score_log[key] = min([local_score, 5])
	        clean_score += min([local_score, 5])
	    else:
	        if(key in ['exposure','travel'] and value=='Yes'):
	            score_log[key] = 3
	            raw_score += 3
	            clean_score += 3
	        elif(value in risk_score.keys()):
	            score_log[key] = risk_score[value]
	            raw_score += risk_score[value]
	            clean_score += risk_score[value]

	# Scale the score to 0-100
	sent_score = min(clean_score, 25) * 4
	req_json['server_log'] = {'score_log':score_log, 'raw_score':raw_score, 'clean_score':clean_score, 'sent_score':sent_score}
	response = {"success": True, "risk_score":sent_score}
	
	# Log request and response in backend
	try:
		userdata.insert_one(req_json)
	except:
		pass

	return flask.jsonify(response)

# Log visitor stats when someone visits webiste
@app.route("/visitor", methods=["POST"])
def log():
	# print("Request json => ",flask.request.json)
	# print("Type =>", flask.request.json)
	# print("Keys => ", flask.request.json.keys())
	visits.insert_one(flask.request.json)
	return flask.jsonify({"success": True})


# To log user feedback and queries
@app.route("/message", methods=["POST"])
def msg():
	print("Request json => ",flask.request.json)
	print("Type =>", flask.request.json)
	print("Keys => ", flask.request.json.keys())
	messages.insert_one(flask.request.json)
	return flask.jsonify({"success": True})


