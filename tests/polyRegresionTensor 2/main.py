import numpy as np
from os.path import exists
import matplotlib.pyplot as plt
import pandas as pd
# import pandas_datareader as web
import datetime as dt
import datetime
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM
from keras.models import load_model
from pandas_datareader import data as pdr
import yfinance as yfin

yfin.pdr_override()


class NodeModelHandler:
    modelControllerPath = './saved_model/my_model/modelControler.txt'
    modelPath = './saved_model/my_model'

    def __init__(self):
        pass

    def checkLocalModel(self):
        print("--> Check Local model")
        existence = exists(self.modelControllerPath)
        # TODO: check on file content (status 1 or 0)
        return existence

    def createModel(self):

        # create and init train model with x years data
        print("Action: ->>> create model")

        # company = "IBM"
        company = "IBM"

        # start = dt.datetime(2012, 1, 1)
        # end = dt.datetime(2020, 1, 1)

        data = pdr.get_data_yahoo("IBM", start="2018-10-10", end="2020-10-10")
        # data = pdr.DataReader(company, 'yahoo', start, end)
        # data = pdr.get_data_yahoo("IBM", start="2018-10-10", end="2020-10-10")

        # ----->Prepare data
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

        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
        model.add(Dropout(0.2))
        model.add(LSTM(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LSTM(units=50))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))

        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, epochs=25, batch_size=32)
        # save the new created model
        model.save(self.modelPath)

        # attach controller
        f = open(self.modelControllerPath, "x")
        f.write('1')
        f.close()

        print("---> Model created and saved succesfully")
        return model

    def loadModel(self):
        print("Load model from local files")
        model = load_model(self.modelPath)
        print("-->check model arhitecture")
        model.summary()

        print("Model loaded succesfully")
        return model

    def initializeModel(self):
        # load or create a new model
        modelExists = self.checkLocalModel()
        initializedModel = None

        if modelExists == True:
            print("Model exists")
            initializedModel = self.loadModel()
        else:
            print("No existing model, create a new one")
            initializedModel = self.createModel()

        return initializedModel


nodeModelHandler = NodeModelHandler()
model = nodeModelHandler.initializeModel()


def predictNextDay(modelParam):
    company = "IBM"
    data = pdr.get_data_yahoo(company, start="2018-10-10", end="2020-10-10")

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column
    prediction_days = 60

    test_data = pdr.get_data_yahoo("TSLA", start="2020-10-10", end="2021-10-10")
    actual_prices = test_data['Close'].values

    total_dataset = pd.concat((data['Close'], test_data['Close']), axis=0)

    model_inputs = total_dataset[len(total_dataset) - len(test_data) - prediction_days:].values
    model_inputs = model_inputs.reshape(-1, 1)
    model_inputs = scaler.transform(model_inputs)

    x_test = []

    for x in range(prediction_days, len(model_inputs)):
        x_test.append(model_inputs[x - prediction_days:x, 0])

    x_test = np.array((x_test))
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    predicted_prices = modelParam.predict(x_test)
    predicted_prices = scaler.inverse_transform(predicted_prices)

    # plt.plot(actual_prices, color="black", label=f"Actual {company} Price")
    # plt.plot(predicted_prices, color="green", label=f"Predicted {company} Price")
    # plt.title(f"{company} Share Price")
    # plt.xlabel('Time')
    # plt.ylabel(f'{company} Share Price')
    # plt.legend()
    # plt.show()

    # Predict next day
    real_data = [model_inputs[len(model_inputs) + 1 - prediction_days:len(model_inputs + 1), 0]]
    real_data = np.array(real_data)
    real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))

    prediction = modelParam.predict(real_data)
    prediction = scaler.inverse_transform(prediction)
    print(f"Prediction: {prediction}")


predictNextDay(model)
