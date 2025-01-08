import speech_recognition as sr
import pyttsx3
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak(text):
    """Convert text to speech."""
    engine.say(text)
    engine.runAndWait()

# Sample dataset of user queries
queries = [
    "hello", "hi", "how are you",
    "what is your name", "tell me a joke",
    "open google", "search for images", "close the app",
    "what is the weather", "how is the traffic today",
    "exit", "shutdown the assistant"
]
categories = [
    "greeting", "greeting", "greeting",
    "info", "info",
    "command", "command", "command",
    "info", "info",
    "exit", "exit"
]

# Convert text to numerical data (Bag of Words model)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(queries)
y = categories

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Naive Bayes classifier
model = MultinomialNB()
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Function to capture voice input
def listen():
    """Capture and process voice input."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        try:
            audio = recognizer.listen(source)
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I didn't understand that.")
            return None
        except sr.RequestError as e:
            print(f"Speech recognition error: {e}")
            return None

# Main interactive loop
if __name__ == "__main__":
    speak("Hello! I am Elara, your assistant.")
    print("Say something...")

    while True:
        user_input = listen()
        if user_input:
            # Transform input to match model format
            test_vector = vectorizer.transform([user_input])
            prediction = model.predict(test_vector)[0]

            # Respond based on the category
            if prediction == "greeting":
                response = "Hi there! How can I assist you?"
            elif prediction == "info":
                response = "Let me find that information for you."
            elif prediction == "command":
                response = "Executing your command."
            elif prediction == "exit":
                response = "Goodbye! Have a great day."
                speak(response)
                break
            else:
                response = "I'm not sure how to respond to that."

            print(f"Elara: {response}")
            speak(response)