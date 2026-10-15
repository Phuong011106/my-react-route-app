import { useReducer, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const product = action.payload;
            const existingIndex = state.items.findIndex(item => item.id === product.id);
            let updatedItems;
            if (existingIndex > -1) {
                updatedItems = [...state.items];
                updatedItems[existingIndex].quantity += 1;
            } else {
                updatedItems = [...state.items, { ...product, quantity: 1 }];
            }
            return calculateTotal(updatedItems);
        }
        case "REMOVE_ITEM": {
            const updatedItems = state.items.filter(item => item.id !== action.payload);
            return calculateTotal(updatedItems);
        }
        case "UPDATE_QUANTITY": {
            const { id, quantity } = action.payload;
            if (quantity <= 0) {
                const updatedItems = state.items.filter(item => item.id !== id);
                return calculateTotal(updatedItems);
            } else {
                const updatedItems = state.items.map(item => item.id === id ? { ...item, quantity: quantity } : item);
                return calculateTotal(updatedItems);
            }
        }
        case "CLEAR_CART": {
            return { items: [], totalQuantity: 0, totalPrice: 0 };
        }
        default:
            return state;
    }
}

function calculateTotal(items) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, totalQuantity, totalPrice };
}

export default function CheckoutLab() {
    const [cartState, dispatch] = useReducer(cartReducer, {
        items: [],
        totalQuantity: 0,
        totalPrice: 0
    });

    const [orderSuccess, setOrderSuccess] = useState(null);

    const productList = [
        { id: 1, name: "ReactJS Book", price: 20 },
        { id: 2, name: "Vite Course", price: 50 },
        { id: 3, name: "UI/UX Sticker", price: 5 }
    ];

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            paymentMethod: "COD",
            agreeTerms: false
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(3, "Họ tên phải có ít nhất 3 ký tự")
                .required("Họ tên không được để trống"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Email không được để trống"),
            phone: Yup.string()
                .matches(/^[0-9]{10,11}$/, "Số điện thoại phải từ 10-11 chữ số")
                .required("Số điện thoại không được để trống"),
            address: Yup.string()
                .required("Địa chỉ không được để trống"),
            paymentMethod: Yup.string()
                .required("Vui lòng chọn phương thức thanh toán"),
            agreeTerms: Yup.boolean().isTrue("Bạn phải đồng ý với điều khoản")

        }),
        onSubmit: (values, { resetForm }) => {
            setOrderSuccess({
                customer: values,
                items: [...cartState.items],
                totalQuantity: cartState.totalQuantity,
                totalPrice: cartState.totalPrice
            });
            dispatch({ type: "CLEAR_CART" });
            resetForm();
        }
    });

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial" }}>
            <h2>🛒 E-Commerce Checkout System (Lab 5)</h2>

            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                {/* Danh sách sản phẩm */}
                <div style={{ flex: 1, border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                    <h3>Danh sách sản phẩm</h3>
                    {productList.map(product => (
                        <div key={product.id} style={{ marginBottom: "10px" }}>
                            <span>{product.name} - ${product.price}</span>
                            <button 
                                onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}
                                style={{ marginLeft: "10px", padding: "3px 8px" }}
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>

                {/* Giỏ hàng */}
                <div style={{ flex: 1, border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                    <h3>Giỏ hàng của bạn</h3>
                    {cartState.items.length === 0 ? (
                        <p style={{ color: "gray" }}>Giỏ hàng đang trống.</p>
                    ) : (
                        <div>
                            {cartState.items.map(item => (
                                <div key={item.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>{item.name} (${item.price})</span>
                                    <div>
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => dispatch({ 
                                                type: "UPDATE_QUANTITY", 
                                                payload: { id: item.id, quantity: parseInt(e.target.value) || 0 } 
                                            })}
                                            style={{ width: "40px", marginRight: "5px" }}
                                        />
                                        <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <p><strong>Tổng số lượng:</strong> {cartState.totalQuantity}</p>
                            <p><strong>Tổng tiền:</strong> ${cartState.totalPrice}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Form thanh toán */}
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", background: "#f9f9f9" }}>
                <h3>Thông tin thanh toán</h3>
                <form onSubmit={formik.handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Họ tên:</label><br />
                        <input 
                            type="text" 
                            name="fullName" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.fullName} 
                            style={{ width: "100%", padding: "6px" }}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                            <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.fullName}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Email:</label><br />
                        <input 
                            type="email" 
                            name="email" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.email} 
                            style={{ width: "100%", padding: "6px" }}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.email}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Số điện thoại:</label><br />
                        <input 
                            type="text" 
                            name="phone" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.phone} 
                            style={{ width: "100%", padding: "6px" }}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.phone}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Địa chỉ:</label><br />
                        <input 
                            type="text" 
                            name="address" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.address} 
                            style={{ width: "100%", padding: "6px" }}
                        />
                        {formik.touched.address && formik.errors.address && (
                            <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.address}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Phương thức thanh toán:</label><br />
                        <label><input type="radio" name="paymentMethod" value="COD" onChange={formik.handleChange} checked={formik.values.paymentMethod === "COD"} /> COD (Thanh toán khi nhận hàng)</label>
                        <label style={{ marginLeft: "15px" }}><input type="radio" name="paymentMethod" value="Card" onChange={formik.handleChange} checked={formik.values.paymentMethod === "Card"} /> Thẻ ngân hàng</label>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            <input 
                                type="checkbox" 
                                name="agreeTerms" 
                                onChange={formik.handleChange} 
                                checked={formik.values.agreeTerms} 
                            /> Đồng ý với các điều khoản mua hàng
                        </label>
                        {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                            <div style={{ color: "red", fontSize: "12px" }}>{formik.errors.agreeTerms}</div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={cartState.items.length === 0}
                        style={{ 
                            padding: "10px 20px", 
                            background: cartState.items.length === 0 ? "#ccc" : "#007bff", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            cursor: cartState.items.length === 0 ? "not-allowed" : "pointer"
                        }}
                    >
                        Thanh toán ngay
                    </button>
                    {cartState.items.length === 0 && (
                        <p style={{ color: "orange", fontSize: "13px", marginTop: "5px" }}>Giỏ hàng trống, không thể thanh toán.</p>
                    )}
                </form>
            </div>

            {orderSuccess && (
                <div style={{ marginTop: "30px", border: "2px solid green", padding: "20px", borderRadius: "8px", background: "#e6ffe6" }}>
                    <h3 style={{ color: "green" }}>🎉 Đặt hàng thành công!</h3>
                    <h4>Thông tin khách hàng:</h4>
                    <p><strong>Họ tên:</strong> {orderSuccess.customer.fullName}</p>
                    <p><strong>Email:</strong> {orderSuccess.customer.email}</p>
                    <p><strong>Điện thoại:</strong> {orderSuccess.customer.phone}</p>
                    <p><strong>Địa chỉ:</strong> {orderSuccess.customer.address}</p>
                    <p><strong>Phương thức thanh toán:</strong> {orderSuccess.customer.paymentMethod}</p>

                    <h4>Sản phẩm đã mua:</h4>
                    <ul>
                        {orderSuccess.items.map((item, index) => (
                            <li key={index}>
                                {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Tổng số lượng:</strong> {orderSuccess.totalQuantity}</p>
                    <p><strong>Tổng tiền thanh toán:</strong> ${orderSuccess.totalPrice}</p>
                </div>
            )}
        </div>
    );
}