from keras.models import load_model
from keras.preprocessing import image
import numpy as np

def predict_image(file_path):
    # Load the model
    model = load_model('./public/best_model.h5')

    # Load the image
    img = image.load_img(file_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array_expanded_dims = np.expand_dims(img_array, axis=0)

    # Predict the class of the image
    prediction = model.predict(img_array_expanded_dims)

    # List of fruit class names in the same order as the output of the model
    class_names = ['Apple', 'Banana', 'Carambola', 'Guava', 'Kiwi', 'Mango', 'Orange', 'Peach']  

    # Get the index of the highest probability
    predicted_class_index = np.argmax(prediction)

    # Return the name of the predicted class
    return class_names[predicted_class_index]

# Function call for instananeous image prediction
print(predict_image('./uploads/Apple_Green_Image.png'))

