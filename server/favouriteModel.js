// Write favourite model here to save to database containing iamge, title, price, shipping, itemid

// From https://www.youtube.com/watch?v=8-NkWFINnUA&list=PLbKN8A2wssqUlVHRBeJIgIvkbyrX4kR0V&index=4
import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
    _id: String,
    image: String,
    title: String,
    price: String,
    shipping: String
});

const Favourite = mongoose.model("Favourite", favouriteSchema);

export default Favourite;
