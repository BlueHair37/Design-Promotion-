import asyncio
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

async def test_ai():
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"API Key found: {'Yes' if api_key else 'No'}")
    if api_key:
        print(f"Key prefix: {api_key[:10]}...")
    
    client = AsyncOpenAI(api_key=api_key)
    
    try:
        print("Attempting to connect to OpenAI...")
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Hello, is this working?"}
            ],
            max_tokens=10
        )
        print("Success!")
        print("Response:", response.choices[0].message.content)
    except Exception as e:
        print("FAILED!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_ai())
