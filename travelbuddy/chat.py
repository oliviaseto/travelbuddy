from openai import OpenAI

def ask_chat(location, dates):
    request = "Create a short itinerary for a trip to " + location + " during " + dates

    client = OpenAI(
        api_key="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",
    )

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo", # maybe try gpt-4-0125-preview later
        messages=[
            {"role": "system", "content": "You're an experienced travel advisor, well-versed in exploring the world's wonders and curating unforgettable experiences. Your expertise in understanding travel preferences and destinations allows you to craft tailored recommendation."},
            {"role": "user", "content": request}
        ],
        max_tokens=500
    )

    model_reply = completion.choices[0].message.content
    tokens = completion.usage.total_tokens
    print("total tokens used: ", tokens)
    return model_reply

print(ask_chat("Japan", "Feb 29 to March 10"))
