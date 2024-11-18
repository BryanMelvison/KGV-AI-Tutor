import requests
import time

def test_context():
    url = "http://localhost:8000/api/v1/chat"
    
    # First message
    response1 = requests.post(url, json={
        "message": "What is the capital of France?"
    })
    print("First Response:", response1.json()["response"])
    
    # Second message (should have context from first)
    response2 = requests.post(url, json={
        "message": "What's the most famous landmark in this city?"
    })
    print("Second Response:", response2.json()["response"])
    
    # Check history
    history = requests.get("http://localhost:8000/api/v1/chat/history").json()
    print("\nFull History:")
    for entry in history:
        print(f"Q: {entry['message']}")
        print(f"A: {entry['response']}\n")

if __name__ == "__main__":
    test_context()