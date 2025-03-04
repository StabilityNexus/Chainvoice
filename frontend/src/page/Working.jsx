import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Working = () => {
  const contentRef = useRef();
  const handlePrint = async () => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">

      <div ref={contentRef} className="bg-white p-6  shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center">
          <img src="whiteLogo.png" alt="" width={100} />
          <div>
          <p className="text-gray-700 text-xs py-1">Issued on March 4, 2025</p>
          <p className="text-gray-700 text-xs ">Payment due by April 3, 2025</p>
          </div>
        </div>

        <div className="border-b border-green-500 pb-4 mb-4">
          <h1 className="text-sm font-bold">Invoice #1</h1>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold">From</h2>
          <p className="text-gray-700 text-xs">0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2</p>
          <p className="text-gray-700 text-xs">Karan Kumawat</p>
          <p className="text-blue-500 underline text-xs">kumawatkaran523@gmail.com</p>
          <p className="text-gray-700 text-xs">JK Lakshmipat University, Jaipur, Rajasthan, India</p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold">Billed to</h2>
          <p className="text-gray-700 text-xs">0x00391942bF77E33E55c7750FBD523627f59937FC</p>
          <p className="text-gray-700 text-xs">Tushar Kumawat</p>
          <p className="text-blue-500 underline text-xs">kumawatkaran523@gmail.com</p>
          <p className="text-gray-700 text-xs">JK Lakshmipat University, Jaipur, Rajasthan, India</p>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Description</th>
              <th className="border p-2">QTY</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Laptop</td>
              <td className="border p-2">1</td>
              <td className="border p-2">996</td>
              <td className="border p-2">0</td>
              <td className="border p-2">0</td>
              <td className="border p-2">996.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-xs">
          <p className="text-right">Amount without tax: <strong>996.00</strong></p>
          <p className="text-right">Total Tax amount: <strong>0.00</strong></p>
          <p className="text-right font-semibold">Total amount: 996.00</p>
        </div>

        <div className="p-2 flex items-center">
          <h1 className="text-xs text-center pr-1">Powered by</h1>
          <img src="whiteLogo.png" alt="" width={80} />
        </div>
      </div>

        <button
          onClick={handlePrint}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Print Invoice
          
        </button>
    </div>
  );
};

export default Working;
