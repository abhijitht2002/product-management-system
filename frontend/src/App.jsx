import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [formdata, setFormdata] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products/");
      const data = await res.json();
      console.log("products: ", data.products);
      setProducts(data.products);
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await fetch(
          `http://localhost:3000/api/products/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata),
          },
        );

        console.log(res);
        setEditingId(null);
      } else {
        const res = await fetch("http://localhost:3000/api/products/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        });

        console.log(res);
      }

      setFormdata({ name: "", category: "", price: "" });
      fetchProducts();
    } catch (error) {
      console.log("Error creating products", error);
    }
  };

  const handleEdit = (product) => {
    setFormdata({
      name: product.name,
      category: product.category,
      price: product.price,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      console.log(res);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Product Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={formdata.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="category"
          name="category"
          value={formdata.category}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="price"
          name="price"
          value={formdata.price}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>Product List</h2>
      <div>
        {products.map((p) => (
          <div key={p._id}>
            <h1>{p.name}</h1>
            <p>{p.category}</p>
            <p>{p.price}</p>

            <button onClick={() => handleEdit(p)}>Update</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
