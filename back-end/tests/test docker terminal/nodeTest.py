from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import eventlet
import numpy as np
from os.path import exists
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, MultiHeadAttention, LayerNormalization, Conv1D, MaxPooling1D, Bidirectional, GRU
from keras.models import load_model
from pandas_datareader import data as pdr
import requests
import yfinance as yfin
import matplotlib.pyplot as plt
yfin.pdr_override()


if __name__ == '__main__':

    # Load data
    company = 'AAPL'
    data = pdr.get_data_yahoo(company, start="2012-01-01", end="2020-01-01")
    print("datA:")
    print(data)

    # Prepare data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column

    prediction_days = 60

    x_train = []
    y_train = []

    for x in range(prediction_days, len(scaled_data)):
        print("x:",x)
        x_train.append(scaled_data[x - prediction_days:x, 0])
        y_train.append(scaled_data[x, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Build The Model

    model = Sequential()

    # model 1
    model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(x_train, y_train, epochs=25, batch_size=32)


    # Load test data
    test_data = pdr.get_data_yahoo(company, start="2020-01-01", end="2023-01-01")
    actual_prices = test_data['Close'].values

    total_dataset = pd.concat((data['Close'], test_data['Close']), axis=0)

    model_inputs = total_dataset[len(total_dataset) - len(test_data) - prediction_days:].values
    model_inputs = model_inputs.reshape(-1,1)

    model_inputs = scaler.transform(model_inputs)

    # Make Predictions on Test Data

    x_test = []
    for x in range(prediction_days, len(model_inputs)):
        x_test.append(model_inputs[x - prediction_days:x, 0])

    x_test  = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    predicted_prices = model.predict(x_test)
    predicted_prices = scaler.inverse_transform(predicted_prices)

    plt.plot(actual_prices, color="black", label=f"Actual Price")
    plt.plot(predicted_prices, color="green", label=f"Predicted Prices")
    plt.title(f"Share Price")
    plt.xlabel(f"Time")
    plt.ylabel(f"Share Price")
    plt.legend()
    plt.show()
