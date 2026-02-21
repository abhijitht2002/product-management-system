const express = require("express")
const mongoose = require("mongoose")
const Product = require("./Product")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connected");
    } catch (error) {
        console.log("mongodb connection failed", error);
    }
}

connectdb()

app.get("/", (req, res) => {
    res.send({ message: "api running" })
})

app.post("/api/products", async (req, res) => {
    try {
        const { name, category, price } = req.body
        if (!name || !category || !price) {
            return res.json({ message: "required" })
        }

        const product = new Product({
            name,
            category,
            price,
            stock: true
        })

        await product.save()
        return res.json({ message: "Product created" })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Can't create product" })
    }
})

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        return res.json({ products })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Can't find products" })
    }
})

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.json({ product })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Can't find product" })
    }
})

app.put("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        return res.json({ message: "product updated", updatedProduct })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Can't update product" })
    }
})

app.delete("/api/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        return res.json({ message: "Product deleted" })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Can't delete product" })
    }
})


app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
})
