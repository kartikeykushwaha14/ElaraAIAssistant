import threading
import pyttsx3
import queue
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)


# Create a queue to manage speech tasks
speech_queue = queue.Queue()

# Initialize a pyttsx3 engine in a dedicated thread
def initialize_engine():
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)  # Adjust speech rate
    engine.setProperty('volume', 1.0)  # Adjust volume
    # List all available voices
    voices = engine.getProperty('voices')

    # Example: Select the first voice (you can change this index based on available voices)
    engine.setProperty('voice', voices[1].id)  # Set voice (change index for different voices)

    return engine

# Function to handle speech in a separate thread
def speak_in_thread():
    engine = initialize_engine()  # Ensure engine is initialized per thread
    while True:
        text = speech_queue.get()
        if text is None:  # Break condition
            break
        try:
            engine.say(text)
            engine.runAndWait()  # Process the queue and speak
        except Exception as e:
            print(f"Error in speaking: {e}")
        finally:
            speech_queue.task_done()

# Function to start the speech handling thread
def start_speech_thread():
    if not any(thread.name == "SpeechThread" for thread in threading.enumerate()):
        speech_thread = threading.Thread(target=speak_in_thread, name="SpeechThread", daemon=True)
        speech_thread.start()

# Process user input and generate AI responses
def process_input(user_input):
    if 'hello' in user_input.lower():
        return "Hi there! How can I assist you today?"
    elif 'weather' in user_input.lower():
        return "Let me check the weather for you."
    elif 'exit' in user_input.lower():
        return "Goodbye! Have a great day."
    else:
        return "I'm not sure how to respond to that."

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    user_input = data.get('input')

    if not user_input:
        return jsonify({"response": "No input received."})

    response = process_input(user_input)
    print(f"Response: {response}")  # Debug: Print response

    # Add response to speech queue
    speech_queue.put(response)

    # Ensure speech thread is running
    start_speech_thread()

    return jsonify({"response": response})

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, threaded=True)
  # python -m http.server
