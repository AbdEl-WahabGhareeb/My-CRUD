import React, { useState, useEffect } from "react";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
    });

    useEffect(() => {
        const savedProducts = localStorage.getItem("allProducts");
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[A-Z][a-z]{4,10}[0-9]{0,4}$/;
        const priceRegex = /^[1-9][0-9]{0,4}$/;

        if (!nameRegex.test(formData.name)) {
            newErrors.name = true;
        }
        if (!priceRegex.test(formData.price)) {
            newErrors.price = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files) {
            setFormData((prev) => ({
                ...prev,
                [name]: `images/${files[0]?.name}`,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const newProducts = [...products];

        if (isEditing && editIndex !== null) {
            newProducts[editIndex] = formData;
        } else {
            newProducts.push(formData);
        }

        setProducts(newProducts);
        localStorage.setItem("allProducts", JSON.stringify(newProducts));

        setFormData({
            name: "",
            price: "",
            description: "",
            category: "",
            image: "",
        });
        setIsEditing(false);
        setEditIndex(null);
        setIsLoading(false);
    };

    const handleDelete = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
        localStorage.setItem("allProducts", JSON.stringify(newProducts));
    };

    const handleEdit = (index) => {
        setIsEditing(true);
        setEditIndex(index);
        setFormData(products[index]);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    {/* <!-- ================ Name ================ --> */}
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        name="name"
                        placeholder="product Name"
                        className="form-control mb-2"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && (
                        <div className="alert alert-danger text-capitalize">
                            product name must start with capital letter, be
                            (4-10) letters and (0-4) numbers in the end
                            (optional).
                        </div>
                    )}

                    {/* <!-- ================ Image ================ --> */}
                    <label htmlFor="productImg">Select Image</label>
                    <input
                        type="file"
                        accept="images/*"
                        id="productImg"
                        name="image"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />

                    {/* <!-- ================ Price ================ --> */}
                    <label htmlFor="productPrice">Product Price</label>
                    <input
                        type="number"
                        id="productPrice"
                        name="price"
                        placeholder="product Price"
                        className="form-control mb-2"
                        value={formData.price}
                        onChange={handleInputChange}
                    />

                    {/* <!-- ================ Category ================ --> */}
                    <label htmlFor="productCategory">Product Category</label>
                    <input
                        type="text"
                        id="productCategory"
                        name="category"
                        placeholder="product Category"
                        className="form-control mb-2"
                        value={formData.category}
                        onChange={handleInputChange}
                    />

                    {/* <!-- ================ Description ================ --> */}
                    <label htmlFor="productDescription">Product Description</label>
                    <textarea
                        id="productDescription"
                        name="description"
                        placeholder="Product Description"
                        className="form-control mb-2"
                        value={formData.description}
                        onChange={handleInputChange}
                    ></textarea>

                    {/* <!-- ================ Buttons ================ --> */}
                    <button
                        type="submit"
                        className="btn btn-outline-success d-block w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : isEditing ? (
                            "Update Product"
                        ) : (
                            "Add Product +"
                        )}
                    </button>

                    <div className="my-5">
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="w-75 mx-auto mt-5">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Img</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Delete</th>
                                <th>Update</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((product, i) => (
                                <tr key={i}>
                                    <td className="align-middle">{i + 1}</td>
                                    <td className="align-middle">
                                        <img
                                            src={product.image}
                                            alt={product.name + "Image"}
                                            className="img-thumbnail"
                                            style={{ width: "100px" }}
                                        />
                                    </td>
                                    <td className="align-middle">
                                        {product.name}
                                    </td>
                                    <td className="align-middle">
                                        {product.price}
                                    </td>
                                    <td className="align-middle">
                                        {product.category}
                                    </td>
                                    <td className="align-middle">
                                        {product.description}
                                    </td>
                                    <td className="align-middle">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(i)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="align-middle">
                                        <button
                                            className="btn btn-info"
                                            onClick={() => handleEdit(i)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
}
