from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import json

def predict_image(file_path):
    # Load the model
    model = load_model('./public/fruit_model.h5')

    # Load the image
    img = image.load_img(file_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array_expanded_dims = np.expand_dims(img_array, axis=0)

    # Predict the class of the image
    prediction = model.predict(img_array_expanded_dims)

    # List of fruit class names in the same order as the output of the model
    class_names = ['Apple', 'Banana', 'Guava', 'Peach', 'Kiwi', 'Mango', 'Orange', 'Carambola']  

    # Average calorie count for each fruit (USDA / U.S. Department of Agriculture Caloric Count)
    calorie_counts = {'Apple': 95, 'Banana': 110, 'Carambola': 41, 'Guava': 37, 'Kiwi': 44, 'Mango': 202, 'Orange': 60, 'Peach': 147}

    # Get the index of the highest probability
    predicted_class_index = np.argmax(prediction)

    # Get the name of the predicted class
    predicted_class = class_names[predicted_class_index]

    # Get the average calorie count for the predicted class
    average_calorie_count = calorie_counts[predicted_class]

    # Return the name of the predicted class and its average calorie count
    return predicted_class, average_calorie_count

# Function call for instantaneous image prediction
predicted_class, average_calorie_count = predict_image('./uploads/Image3.png')
print(f"{predicted_class}: {average_calorie_count} calorie average")


## Instantaneous Training!!!
# import sys

# def predict_image(file_path):
#     # Load the model
#     model = load_model('./public/fruit_model.h5')

#     # Load the image
#     img = image.load_img(file_path, target_size=(150, 150))
#     img_array = image.img_to_array(img)
#     img_array_expanded_dims = np.expand_dims(img_array, axis=0)

#     # Predict the class of the image
#     prediction = model.predict(img_array_expanded_dims)

#     # List of fruit class names in the same order as the output of the model
#     class_names = ['Apple', 'Banana', 'Guava', 'Peach', 'Kiwi', 'Mango', 'Orange', 'Carambola']  

#     # Average calorie count for each fruit (USDA / U.S. Department of Agriculture Caloric Count)
#     calorie_counts = {'Apple': 95, 'Banana': 110, 'Carambola': 41, 'Guava': 37, 'Kiwi': 44, 'Mango': 202, 'Orange': 60, 'Peach': 147}

#     # Get the index of the highest probability
#     predicted_class_index = np.argmax(prediction)

#     # Get the name of the predicted class
#     predicted_class = class_names[predicted_class_index]

#     # Get the average calorie count for the predicted class
#     average_calorie_count = calorie_counts[predicted_class]

#     # Return the name of the predicted class and its average calorie count
#     return predicted_class, average_calorie_count

# # Get the file path from the command line arguments
# file_path = sys.argv[1]

# # Function call for instantaneous image prediction
# predicted_class, average_calorie_count = predict_image(file_path)

# # Print the predicted class and average calorie count
# print(f"Predicted class: {predicted_class}, Average calorie count: {average_calorie_count}")