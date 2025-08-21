import pandas as pd
import inflect
import json

# Initialize inflect engine
p = inflect.engine()

def normalize_word(word):
    word = word.lower().strip()
    singular = p.singular_noun(word)
    return singular if singular else word


# Load your dataset
df = pd.read_csv("indian_food.csv")

# Split ingredients into lists
df['ingredients_list'] = df['ingredients'].str.split(',')
df['ingredients_list'] = df['ingredients_list'].apply(lambda x: [normalize_word(i.strip()) for i in x])

# Create full ingredient matrix
ingredient_matrix = df['ingredients_list'].str.join('|').str.get_dummies()

# Count frequency of each ingredient across recipes
ingredient_counts = ingredient_matrix.sum().sort_values(ascending=False)

# Select top 50 most frequent ingredients
top_50_ingredients = ingredient_counts.head(50).index

# Create reduced ingredient matrix
final_df = pd.concat([df[['name']], ingredient_matrix[top_50_ingredients]], axis=1)

# Save to CSV and Excel
final_df.to_csv("ingredient_matrix_top50.csv", index=False)

inverted_index = {}

for ingredient in final_df.columns[1:]:   # skip 'name'
    recipes = final_df['name'][final_df[ingredient] == 1].tolist()
    inverted_index[ingredient] = recipes

with open("inverted_index.json", "w", encoding="utf-8") as f:
        json.dump(inverted_index, f, indent=2)
