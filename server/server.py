from flask import Flask, jsonify

#app instance
app = Flask(__name__)

@app.route("/api/home",methods = ['GET']) #The only methods we will accept at the route /api/home is GET
def return_home():
    #The function jsonify
    return jsonify({
        'message':"Hello World"
        })

if __name__ == "__main__":
    app.run(debug = True) #remove debug flag when deploying to prod
