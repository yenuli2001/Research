import google.generativeai as genai
from rest_framework.decorators import api_view
from rest_framework.response import Response
from decouple import config
from pymongo import MongoClient
from datetime import datetime

# Configure Gemini
genai.configure(api_key=config('GEMINI_API_KEY'))

# MongoDB Connection
client = MongoClient(config('MONGO_URI'))
db = client['code_generation']
collection = db['generated_codes']

def clean_generated_code(code):
    """Remove unwanted parts like 'python' and triple backticks from the generated code."""
    return code.replace('python', '').replace('```', '').strip()

def generate_django_code(uml_description):
    """Generate Django backend code based on UML description."""
    prompt = f"""
    Generate Django backend code (models, views, serializers, URLs) based on this UML:
    {uml_description}
    Provide only the code, no explanations.
    """

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        cleaned_code = clean_generated_code(response.text)
        return cleaned_code
    except Exception as e:
        print(f"Error generating Django code: {str(e)}")
        return None

@api_view(['POST'])
def generate_code(request):
    uml_description = request.data.get('description')

    if not uml_description:
        return Response({'error': 'No UML description provided'}, status=400)

    try:
        django_code = generate_django_code(uml_description)
        if not django_code:
            return Response({'error': 'Failed to generate Django code'}, status=500)

        # Create a dictionary to store all the data
        code_entry = {
            "uml_description": uml_description,
            "generated_code": django_code,
            "created_at": datetime.utcnow()
        }

        # Insert the data into MongoDB
        collection.insert_one(code_entry)

        return Response({
            'code': django_code,
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)