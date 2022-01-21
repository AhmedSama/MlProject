from os.path import join
from flask import Flask, render_template, request,jsonify
import detectImage
from random import randint
import base64
from os import path

absPath = path.dirname(path.realpath(__file__))

app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/api/detect",methods = ["POST"])
def detect():
    # take only the base64 string
    data = request.get_json()["data"].split(";")[-1].split(",")[-1]
    data = data.encode()
    image_64_decode = base64.decodebytes(data)
    name = 'Image'+str(randint(1000,100000))+".png"
    image_result = open(join(absPath,"images/test/",name), 'wb') 
    image_result.write(image_64_decode)
    image_result.close()

    if detectImage.StartDetect(name) == "happy":
        return jsonify({"face":"happy"})

    elif detectImage.StartDetect(name) == "sad":
        return jsonify({"face":"sad"})

    elif detectImage.StartDetect(name) == "white":
        return jsonify({"face":"white"})


if __name__ == "__main__":
    app.run(debug=True)
















