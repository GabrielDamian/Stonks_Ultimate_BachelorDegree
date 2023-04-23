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
from keras.layers import Dense, Dropout, LSTM, MultiHeadAttention, LayerNormalization, Conv1D, MaxPooling1D, Bidirectional, GRU,Flatten, ELU, LeakyReLU, BatchNormalization, Activation
from keras.regularizers import L2
from keras.models import load_model
from pandas_datareader import data as pdr
import requests
import yfinance as yfin
import matplotlib.pyplot as plt
yfin.pdr_override()
import math


def calculate_mae(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += abs(actual_prices[i] - predicted_prices[i])
    mae = error / n
    return mae

def calculate_mse(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += (actual_prices[i] - predicted_prices[i]) ** 2
    mse = error / n
    return mse

def calculate_rmse(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += (actual_prices[i] - predicted_prices[i]) ** 2
    mse = error / n
    rmse = math.sqrt(mse)
    return rmse


if __name__ == '__main__':

    # Load data
    company = 'AAPL'
    data = pdr.get_data_yahoo(company, start="2012-01-01", end="2020-01-01")
    print("datA:", len(data))

    # Prepare data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column

    prediction_days = 60

    x_train = []
    y_train = []

    for x in range(prediction_days, len(scaled_data)):
        x_train.append(scaled_data[x - prediction_days:x, 0])
        y_train.append(scaled_data[x, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Build The Model

    model = Sequential()

    # model 1 - no fix
    # model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
    # model.add(Dropout(0.2))
    # model.add(LSTM(units=50, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(LSTM(units=50))
    # model.add(Dropout(0.2))
    # model.add(Dense(units=1))

    # model 2 - no fix
    # model.add(Bidirectional(LSTM(units=50, return_sequences=True), input_shape=(x_train.shape[1], 1)))
    # model.add(Dropout(0.2))
    # model.add(Bidirectional(LSTM(units=50, return_sequences=True)))
    # model.add(Dropout(0.2))
    # model.add(Bidirectional(LSTM(units=50)))
    # model.add(Dropout(0.2))
    # model.add(Dense(units=1))


    # model 3 - no fix
    # model.add(GRU(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    # model.add(Dropout(0.2))
    # model.add(GRU(units=50, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(GRU(units=50))
    # model.add(Dropout(0.2))
    # model.add(Dense(units=1))


    # model 4 - no fix
    # model.add(Bidirectional(LSTM(units=50, return_sequences=True), input_shape=(x_train.shape[1], 1)))
    # model.add(Dropout(0.2))
    # model.add(Bidirectional(LSTM(units=50, return_sequences=True)))
    # model.add(Dropout(0.2))
    # model.add(Bidirectional(LSTM(units=50)))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=1))

    # model 5 - no fix
    # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=50, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(LSTM(units=50))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=1))

    # model 6 - no fix
    # model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=64, return_sequences=True))
    # model.add(GRU(units=32, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=64, activation='relu'))
    # model.add(Dense(units=1))

    # model 7 - no fix
    # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=50, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=1))

    # model 8 - no fix
    # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=50, return_sequences=True))
    # model.add(GRU(units=50, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=1))


    # model 9 - no fix
    # model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=64, return_sequences=True))
    # model.add(GRU(units=32, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=64))
    # model.add(ELU(alpha=1.0))
    # model.add(Dense(units=1))


    # model 10 - no fix
    # model.add(Conv1D(filters=32, kernel_size=3, activation='linear', input_shape=(x_train.shape[1], 1)))
    # model.add(LeakyReLU(alpha=0.1))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(LSTM(units=64, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=64))
    # model.add(LeakyReLU(alpha=0.1))
    # model.add(Dense(units=1))

    # model 11 - no fix
    # model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(GRU(units=64, return_sequences=True, kernel_regularizer=L2(0.01)))
    # model.add(Dropout(0.2))
    # model.add(Flatten())
    # model.add(Dense(units=64, activation='relu', kernel_regularizer=L2(0.01)))
    # model.add(Dense(units=1))


    # model 12
    # model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
    # model.add(MaxPooling1D(pool_size=2))
    # model.add(Dropout(0.2))
    # model.add(LSTM(units=64, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(LSTM(units=64))
    # model.add(Dropout(0.2))
    # model.add(Dense(units=1))


    # model 13
    # model.add(GRU(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    # model.add(Dropout(0.2))
    # model.add(GRU(units=64, return_sequences=True))
    # model.add(Dropout(0.2))
    # model.add(GRU(units=64))
    # model.add(Dropout(0.2))
    # model.add(Dense(units=1))


    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(x_train, y_train, epochs=25, batch_size=32)

    # Load test data
    test_data = pdr.get_data_yahoo(company, start="2020-01-01", end="2023-01-01")
    print("test datA:", len(test_data))

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


    print("predicted_prices len:",predicted_prices)
    # predicted_prices = [[a[-1][0]] for a in predicted_prices]

    # FIX FOR DENSE MODELS
    # FIX:
    # test = []
    # for i in range(len(predicted_prices)):
    #     test.append(predicted_prices[i][0])
    # predicted_prices = test



    predicted_prices = scaler.inverse_transform(predicted_prices)
    # predicted_prices = scaler.inverse_transform(predicted_prices)

    # actual_prices
    # predicred_prices

    print("1: ", len(predicted_prices))
    print("2: ", len(actual_prices))

    print(predicted_prices)
    print(actual_prices)


    plt.plot(actual_prices, color="black", label=f"Actual Price")
    plt.plot(predicted_prices, color="green", label=f"Predicted Prices")
    plt.title(f"Share Price")
    plt.xlabel(f"Time")
    plt.ylabel(f"Share Price")
    plt.legend()
    plt.show()


    # STATS
    mae = calculate_mae(predicted_prices, actual_prices)
    mse = calculate_mse(predicted_prices, actual_prices)
    rmse = calculate_rmse(predicted_prices, actual_prices)

    print("STATS:")
    print("mae: ", mae)
    print("mse: ", mse)
    print("rmse: ", rmse)
