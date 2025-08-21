from fastapi import FastAPI, Query
import json
import inflect

app = FastAPI(title="Recipe Search API")

# Inflect engine for singular/plural normalization
p = inflect.engine()

def normalize_word(word):
    """Lowercase + singularize"""
    word = word.lower().strip()
    singular = p.singular_noun(word)
    return singular if singular else word

with open("inverted_index.json", "r", encoding="utf-8") as f:
    inverted_index = json.load(f)

def search_recipes(leftovers: str):
    ingredients = [normalize_word(ing) for ing in leftovers.split(",")]
    recipe_scores = {}

    for ing in ingredients:
        if ing in inverted_index:
            for recipe in inverted_index[ing]:  
                recipe_scores[recipe] = recipe_scores.get(recipe, 0) + 1

    ranked = sorted(recipe_scores.items(), key=lambda x: x[1], reverse=True)
    return ranked

@app.get("/search")
def search(leftovers: str = Query(..., description="Comma-separated ingredients")):
    """
    Example: /search?leftovers=onion,tomatoes,rice
    """
    results = search_recipes(leftovers)
    return {"input": leftovers, "results": results}