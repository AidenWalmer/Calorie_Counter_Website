# # NOTE: oneDNN (oneAPI Deep Neural Network Library) custom operations are enabled. oneDNN is an open-source performance library for deep learning applications that optimizes deep learning primitives on CPUs.

import pandas as pd
import numpy as np

import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.image as img

import cv2
import itertools
import pathlib
import warnings
import os
import random
import time
import gc

# from IPython.display import Markdown, display # For Jupyter Notebook
from PIL import Image
from random import randint
warnings.filterwarnings('ignore')

from imblearn.over_sampling import SMOTE

from sklearn.model_selection import train_test_split
from sklearn.metrics import matthews_corrcoef as MCC
from sklearn.metrics import balanced_accuracy_score as BAS
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

import keras
from tensorflow import keras
from keras import Sequential
from keras import layers
import tensorflow as tf
import tensorflow_addons as tfa
from keras.preprocessing import image_dataset_from_directory
from keras.utils import plot_model
from keras import Sequential, Input
from keras.utils import to_categorical
from keras.utils import to_categorical
from keras.layers import Dense, Dropout, SeparableConv2D, Activation, BatchNormalization, Flatten, GlobalAveragePooling2D, Conv2D, MaxPooling2D
from keras.layers import Conv2D, Flatten
from keras.models import load_model

from keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint
from keras.applications.inception_v3 import InceptionV3
from keras.preprocessing.image import ImageDataGenerator as IDG


def printmd(string):   
    # display(Markdown(string)) for Jupyter Notebook
    print(string)
    
np.random.seed(0) # Add random seed of training for reproducibility

def load_images_from_folder(folder,only_path = False, label = ""):
    if only_path == False:
        images = []
        for filename in os.listdir(folder):
            img = plt.imread(os.path.join(folder,filename))
            if img is not None:
                images.append(img)
        return images
    else:
        path = []
        for filename in os.listdir(folder):
            img_path = os.path.join(folder,filename)
            if img_path is not None:
                path.append([label,img_path])
        return path

images = []
dirp = "C:/xampp/htdocs/capstone/Calorie_Counter_Website/Fruit/"
for f in os.listdir(dirp):
    # Checks if any filename in the directory (including its subdirectories) contains "png"
    if any("png" in filename for filename in os.listdir(dirp+f)):
        images += load_images_from_folder(dirp+f,True,label = f)
    else: 
        for d in os.listdir(dirp+f):
            images += load_images_from_folder(dirp+f+"/"+d,True,label = f)
            
df = pd.DataFrame(images, columns = ["fruit", "path"])

from sklearn.utils import shuffle
df = shuffle(df, random_state = 0)
df = df.reset_index(drop=True)

fruit_names = sorted(df.fruit.unique())
mapper_fruit_names = dict(zip(fruit_names, [t for t in range(len(fruit_names))]))
df["label"] = df["fruit"].map(mapper_fruit_names)
print(mapper_fruit_names)

df


# Number of pictures for each category of fruit
fc = df["fruit"].value_counts()
plt.figure(figsize=(10,5))
sns.barplot(x = fc.index, y = fc, palette = "crest")
plt.title("Number of pictures of each category", fontsize = 15)
plt.xticks(rotation=90)
plt.show()

# Image Detection Software Test
num_rows = 4
num_cols = 5
fig_width = 15
fig_height = fig_width * num_rows / num_cols  # Maintain the aspect ratio

# Displays a grid of subplots with their corresponding images and fruit labels 
fig, axes = plt.subplots(nrows=num_rows, ncols=num_cols, figsize=(fig_width, fig_height),
                         subplot_kw={'xticks': [], 'yticks': []})

for i, ax in enumerate(axes.flat):
    ax.imshow(plt.imread(df.path[i+20]), aspect='auto')  # Adjust the aspect ratio of the images
    ax.set_title(df.fruit[i+20], fontsize=12)

plt.tight_layout(pad=1.0)  # Increase pad for better spacing between subplots
plt.show()

# Displays the resized images (before/after) 
img = plt.imread(df.path[20])
plt.imshow(img)
plt.title("Original image")
plt.show()

plt.imshow(cv2.resize(img, (150,150)))
plt.title("After resizing")
plt.show()


# Splits the df into smaller parts
def cut_df(df, number_of_parts, part):

    if part < 1:
        print("Error, the part should be at least 1")
    elif part > number_of_parts:
        print("Error, the part cannot be higher than the number_of_parts")
        
    number_imgs_each_part = int(df.shape[0]/number_of_parts)
    idx1 = (part-1) * number_imgs_each_part
    idx2 = part * number_imgs_each_part
    return df.iloc[idx1:idx2]

# Loads the images from the specified df path and resizes them to (150x150) 
def load_img(df):
    img_paths = df["path"].values
    img_labels = df["label"].values
    # print("img_paths type:", type(img_paths))
    # print("img_labels type:", type(img_labels))
    X = []
    y = []
    
    for i,path in enumerate(img_paths):
        try:
            img =  plt.imread(path)
            img = cv2.resize(img, (150,150))
            # print(f"Resized image {i+1} shape: {img.shape}")
            label = img_labels[i]
            X.append(img)
            y.append(label)
        except Exception as e:
            # print(f"Error loading image at index {i}: {e}")
            continue
    # print("X length:", len(X))
    # print("y length:", len(y))
    return np.array(X), np.array(y)

# Creating the model 
def create_model():
    shape_img = (150,150,3)
    
    model = Sequential()

    model.add(Conv2D(filters=32, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=64, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=64, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=64, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=64, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=64, kernel_size=(3,3),input_shape=shape_img, activation='relu', padding = 'same'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Flatten())

    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(Dropout(0.5))

    model.add(Dense(len(mapper_fruit_names)))
    model.add(Activation('softmax'))

    model.compile(loss='categorical_crossentropy',optimizer='adam',metrics=['accuracy'])
    
    return model

# Converts one-hot encoded categorical predictions back to class labels
def from_categorical(lst):
    lst = lst.tolist()
    lst2 = []
    for x in lst:
        lst2.append(x.index(max(x)))
    return lst2

# Displays various statistics related to the performance of a classification model
def display_stats(y_test, pred):
    print(f"### Result of the predictions using {len(y_test)} test data ###\n")
    y_test_class = from_categorical(y_test)
    print("Classification Report:\n")
    print(classification_report(y_test_class, pred))
    print("\nConfusion Matrix:\n\n")
    print(confusion_matrix(y_test_class, pred))
    print("\n")
    printmd(f"# Accuracy: {round(accuracy_score(y_test_class, pred),5)}")

# Plots the training history of the neural network model
def plot_training(model):
    history = pd.DataFrame(model.history.history)
    history[["accuracy","val_accuracy"]].plot()
    plt.title("Training results")
    plt.xlabel("# epoch")
    plt.show()

# Setting up the model, preparing the data for training, and defining callbacks 
model = create_model()
hists = []
divisor = 5

start_time = time.time()
X_train, y_train = load_img(cut_df(df,divisor,1))
y_train = to_categorical(y_train)

callbacks = [EarlyStopping(monitor='val_loss', patience=10),
             ModelCheckpoint(filepath='best_model.h5', monitor='val_loss', save_best_only=True)]

# Training the CNN model, epochs: iterations 
model.fit(X_train, y_train, batch_size=128, epochs=50, callbacks=callbacks, validation_split = 0.1, verbose = 1)
hists.append(model.history.history)


# Garbage collection (reclaiming memory that is no longer being used)
gc.collect()

# Save the model for deployment or further testing withoiut retaining 
model.save('fruit_model.h5')

# Display how long the model took to train
time_model = time.time() - start_time
print(f"Time to train the model: {int(time_model)} seconds")

# Load the saved model
loaded_model = load_model('fruit_model.h5')


# Displays the training and validation accuracies change as the model trains over multiple epochs
acc = []
val_acc = []
for i in range(len(hists)):
    acc += hists[i]["accuracy"]
    val_acc += hists[i]["val_accuracy"]
hist_df = pd.DataFrame({"# Epoch": [e for e in range(1,len(acc)+1)],"Accuracy": acc, "Val_accuracy": val_acc})
hist_df.plot(x = "# Epoch", y = ["Accuracy","Val_accuracy"])
plt.title("Accuracy vs Validation Accuracy")
plt.show()

# Displays the performance of the trained model on a specific subset of the dataset
warnings.filterwarnings("ignore")

X, y = load_img(cut_df(df, 20, 20))
pred = np.argmax(model.predict(X), axis=1)
y_test = to_categorical(y)

display_stats(y_test, pred)

# Displays a subset of images along with their true labels and the the labels predicted by the model
fig, axes = plt.subplots(nrows=4, ncols=4, figsize=(10, 10),
                        subplot_kw={'xticks': [], 'yticks': []})

for i, ax in enumerate(axes.flat):
    ax.imshow(X[-i])
    if fruit_names[y[-i]] == fruit_names[pred[-i]]:
        ax.set_title(f"True label: {fruit_names[y[-i]]}\nPredicted label: {fruit_names[pred[-i]]}", color="green")
    else:
        ax.set_title(f"True label: {fruit_names[y[-i]]}\nPredicted label: {fruit_names[pred[-i]]}", color="red")

plt.tight_layout()
plt.show()