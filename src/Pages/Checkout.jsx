"use client";
import { useState, useEffect, useContext } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { cartContext } from "../App";
import emailjs from "emailjs-com";

const deliveryMethods = [
  {
    id: 1,
    title: "Standard",
    turnaround: "4–10 business days",
    price: "$5.00",
  },
  { id: 2, title: "Express", turnaround: "2–5 business days", price: "$16.00" },
];

export default function Checkout() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );
  const { cart, subtotal, getAllCart, getTotalPrice, render } =
    useContext(cartContext);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    getAllCart();
  }, [render]);

  useEffect(() => {
    getTotalPrice();
  }, [getAllCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const templateParams = {
      to_email: formData["email-address"],
      from_name: "Beauty Mart",
      to_name: `${formData["first-name"]} ${formData["last-name"]}`,
      address: formData.address || "N/A",
      city: formData.city || "N/A",
      country: formData.country || "N/A",
      postalCode: formData["postal-code"] || "N/A",
      phone: formData.phone || "N/A",
      deliveryMethod: selectedDeliveryMethod?.title || "N/A",
      cartItems: cart.length
        ? cart
            .map((item) => `${item.name} (x${item.quantity}) - $${item.price}`)
            .join("\n")
        : "No items",
      total: subtotal ? `$${subtotal}` : "N/A",
    };

    try {
      await emailjs.send(
        "service_8rbbb4b",
        "template_q83entp",
        { ...templateParams, to_email: "your-email@example.com" },
        "sLD3si9EicpcVqgNl"
      );
      await emailjs.send(
        "service_8rbbb4b",
        "template_0vm5pth",
        templateParams,
        "sLD3si9EicpcVqgNl"
      );
      alert("Order confirmation sent to you and the customer!");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first-name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last-name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Delivery Method
              </label>
              <RadioGroup
                value={selectedDeliveryMethod}
                onChange={setSelectedDeliveryMethod}
                className="mt-2 space-y-2"
              >
                {deliveryMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border p-3 rounded-md flex justify-between items-center cursor-pointer ${
                      selectedDeliveryMethod.id === method.id
                        ? "border-indigo-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedDeliveryMethod(method)}
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {method.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {method.turnaround}
                      </span>
                    </span>
                    <span className="text-sm font-medium">{method.price}</span>
                    {selectedDeliveryMethod.id === method.id && (
                      <CheckCircleIcon className="size-5 text-indigo-600" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium shadow-sm hover:bg-indigo-700"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
