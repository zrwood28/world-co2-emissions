
import numpy as np
import sqlalchemy
from flask import Flask, render_template, jsonify
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import json

app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching
 
protocol = "postgresql"
username = "postgres"
password = "bootcamp"
host = "localhost"
port = 5432
database_name = "world_carbon_emissions_db"

engine = create_engine(f"{protocol}://{username}:{password}@{host}:{port}/{database_name}")

Base = automap_base()

try:
    Base.prepare(engine, reflect = True)
    print("Connection to the database is successful.")

except:
    print("Connection to the database is unsuccessful, please verify elements of connection string.")

w = Base.classes.world_co2

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/data")
def data():

    session = Session(engine)

    # query all years
    results = session.query(w.id, w.country, w.year, w.iso_code, w.population, w.gdp, w.co2, w.cement_co2, w.coal_co2, w.flaring_co2,\
                       w.gas_co2, w.oil_co2, w.other_industry_co2, w.co2_per_capita, w.cement_co2_per_capita, w.coal_co2_per_capita,\
                       w.flaring_co2_per_capita, w.gas_co2_per_capita, w.oil_co2_per_capita, w.other_co2_per_capita,\
                       w.share_global_co2, w.share_global_cumulative_co2).all()

    session.close()

    results_list = []
    for id, country, year, iso_code, population, gdp, co2, cement_co2, coal_co2, flaring_co2, gas_co2, oil_co2, other_industry_co2,\
    co2_per_capita, cement_co2_per_capita, coal_co2_per_capita, flaring_co2_per_capita, gas_co2_per_capita, oil_co2_per_capita,\
    other_co2_per_capita, share_global_co2, share_global_cumulative_co2 in results:

        results_dict = {}
        results_dict['id'] = id
        results_dict['country'] = country
        results_dict['year'] = year
        results_dict['iso_code'] = iso_code
        results_dict['population'] = population
        results_dict['gdp'] = gdp
        results_dict['co2'] = co2
        results_dict['cement_co2'] = cement_co2   
        results_dict['coal_co2'] = coal_co2
        results_dict['flaring_co2'] = flaring_co2
        results_dict['gas_co2'] = gas_co2
        results_dict['oil_co2'] = oil_co2
        results_dict['other_industry_co2'] = other_industry_co2
        results_dict['co2_per_capita'] = co2_per_capita
        results_dict['cement_co2_per_capita'] = cement_co2_per_capita
        results_dict['coal_co2_per_capita'] = coal_co2_per_capita 
        results_dict['flaring_co2_per_capita'] = flaring_co2_per_capita
        results_dict['gas_co2_per_capita'] = gas_co2_per_capita
        results_dict['oil_co2_per_capita'] = oil_co2_per_capita
        results_dict['other_co2_per_capita'] = other_co2_per_capita
        results_dict['share_global_co2'] = share_global_co2
        results_dict['share_global_cumulative_co2'] = share_global_cumulative_co2
    
        results_list.append(results_dict)

    return jsonify(results_list)

@app.route("/readjsonfile/<filename>")
def ReadJsonFileRoute(filename):    
    ''' Opens a JSON or GeoJSON file and then returns
        its contents to the client. The filename is specified
        as a parameter. '''

    # Note that we have to assemble the complete filepath. We do this on the 
    # server because the client has no knowledge of the server's file structure.
    filepath = f"static/data/{filename}"

    # Add some simple error handling to help if the user entered an invalid
    # filename. 
    try: 
        with open(filepath) as f:    
            json_data = json.load(f)
    except:
        json_data = {'Error': f'{filename} not found on server!'}

    print('Returning data from a file')

    return jsonify(json_data)
 
if __name__ == "__main__":
    app.run(debug = True)