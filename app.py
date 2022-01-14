import os
from flask import Flask, render_template, request,jsonify
import detectImage
from random import randint
import base64
from pathlib import Path
from os import join

absPath = Path(__file__).parent


app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/detect",methods = ["POST"])
def detect():
    # take only the base64 string
    data = request.get_json()["data"].split(";")[-1].split(",")[-1]
    data = data.encode()
    image_64_decode = base64.decodestring(data)
    name = 'rand'+str(randint(1000,100000))+".png"
    image_result = open(join(absPath,"/images/test/",name), 'wb') 
    image_result.write(image_64_decode)
    if detectImage.StartDetect(name) == "happy":
        print("happy")
        return jsonify({"face":"happy"})
    elif detectImage.StartDetect(name) == "sad":
        
        print("sad")
        return jsonify({"face":"sad"})
    elif detectImage.StartDetect(name) == "white":
        print("white")
        return jsonify({"face":"white"})


if __name__ == "__main__":
    app.run(debug=True)
















