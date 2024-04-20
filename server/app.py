# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import logging
# import os
# from langchain.docstore.document import Document
# from langchain.indexes import VectorstoreIndexCreator
# from langchain_community.utilities import ApifyWrapper
# from langchain_openai import OpenAIEmbeddings  # Updated import
# from dotenv import load_dotenv
# import validators

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# openai_api_key = os.environ.get("OPENAI_API_KEY")
# apify_api_token = os.environ.get("APIFY_API_TOKEN")

# apify = ApifyWrapper()


# @app.route('/query', methods=['POST'])
# def query():
#     try:
#         data = request.get_json()
#         print(data)
#         url = data.get('url')
#         print(url)
#         query_text = data.get('query')

#         # Validate the URL
#         if not validators.url(url):
#             return jsonify({"error": "Invalid URL"}), 400

#         # Assuming you handle the document retrieval here without MongoDB
#         loader = apify.call_actor(
#             actor_id="apify/website-content-crawler",
#             run_input={"startUrls": [
#                 {"url": url}], "maxCrawlPages": 1, "crawlerType": "cheerio"},
#             dataset_mapping_function=lambda item: Document(
#                 page_content=item["text"] or "", metadata={"source": item["url"]}),
#         )
#         print(loader)

#         index = VectorstoreIndexCreator().from_loaders([loader])
#         print(loader)
#         print(index)

#         result = index.query_with_sources(query_text)
#         print(f"Result type: {type(result)}, Result content: {result}")

#         return jsonify({"answer": result["answer"], "sources": result["sources"]})

#     except Exception as e:
#         logging.error(f"An error occurred: {str(e)}")
#         logging.error(f"Error type: {type(e)}")
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from langchain.docstore.document import Document
from langchain.indexes import VectorstoreIndexCreator
# from langchain.utilities import ApifyWrapper
from langchain_community.utilities import ApifyWrapper
from dotenv import load_dotenv
import validators  # Import the validators module

load_dotenv()

app = Flask(__name__)
CORS(app)

openai_api_key = os.environ.get("OPENAI_API_KEY")
apify_api_token = os.environ.get("APIFY_API_TOKEN")

apify = ApifyWrapper()

logging.basicConfig(level=logging.DEBUG)


@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()

        url = data.get('url')
        query_text = data.get('query')

        logging.debug(f"URL: {url}")
        logging.debug(f"Query Text: {query_text}")

        # Validate the URL
        if not validators.url(url):
            return jsonify({"error": "Invalid URL"}), 400

        loader = apify.call_actor(
            actor_id="apify/website-content-crawler",
            run_input={"startUrls": [{"url": url}],
                       "maxCrawlPages": 2, "crawlerType": "cheerio"},
            dataset_mapping_function=lambda item: Document(
                page_content=item["text"] or "", metadata={"source": item["url"]}
            ),
        )

        index = VectorstoreIndexCreator().from_loaders([loader])

        result = index.query_with_sources(query_text)
        print(result)

        return jsonify({"answer": result["answer"], "sources": result["sources"]})

    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
