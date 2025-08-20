import os
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from xgboost import XGBRegressor
import numpy as np

def train_model(preprocessed_path, model_save_path):
    if not os.path.exists(preprocessed_path):
        raise FileNotFoundError(f"File not found: {preprocessed_path}")

    # --- Load preprocessed data ---
    df = pd.read_csv(preprocessed_path)

    # --- Drop rows with missing target ---
    df = df.dropna(subset=["food_waste_kg"])

    # --- Features & target ---
    X = df.drop(columns=["food_waste_kg"])
    y = df["food_waste_kg"]
    order=X.columns.tolist()

    # --- Train/Test split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # --- XGBoost model ---
    xgb = XGBRegressor(
        objective="reg:squarederror",
        n_jobs=-1,
        random_state=42
    )

    # --- Hyperparameter grid ---
    param_dist = {
        "n_estimators": [300, 500, 700, 1000],
        "max_depth": [5, 7, 9, 12],
        "learning_rate": [0.01, 0.05, 0.1, 0.2],
        "subsample": [0.6, 0.7, 0.8, 0.9],
        "colsample_bytree": [0.6, 0.7, 0.8, 0.9],
        "gamma": [0, 0.1, 0.3, 0.5]
    }

    # --- Randomized Search ---
    search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_dist,
        n_iter=50,
        scoring="r2",
        cv=5,
        verbose=1,
        random_state=42
    )

    search.fit(X_train, y_train)

    best_model = search.best_estimator_

    # --- Evaluation ---
    y_pred = best_model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Best parameters: {search.best_params_}")
    print(f"Model evaluation on test set:")
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"R^2 Score: {r2:.4f}")

    # --- Save model ---
    joblib.dump({"model":best_model, "order": order}, model_save_path)
    print(f"Trained model saved to: {model_save_path}")

    return best_model


if __name__ == "__main__":
    preprocessed_path = r"..\data\processed\preprocessed_data.csv"
    model_save_path = r"..\models\food_waste_model.pkl"

    # Ensure models folder exists
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)

    model = train_model(preprocessed_path, model_save_path)
