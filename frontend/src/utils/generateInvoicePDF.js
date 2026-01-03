import jsPDF from "jspdf";
import { ethers } from "ethers";
import { getWagmiChainName, getWagmiChainInfo } from "./wagmiChainHelpers";

/**
 * Load logo image with multiple fallback methods
 * Returns base64 data URL or null
 */
const loadLogoImage = async () => {
  try {
    const invoiceElement = document.getElementById("invoice-print");
    const logoImg = invoiceElement?.querySelector('img[src="/logo.png"]') || 
                    invoiceElement?.querySelector('img[src*="logo"]');
    
    if (logoImg) {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 2000);
          logoImg.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          logoImg.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      }
      
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = logoImg.naturalWidth;
        canvas.height = logoImg.naturalHeight;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(logoImg, 0, 0);
        
        const logoDataUrl = canvas.toDataURL('image/png');
        if (logoDataUrl && logoDataUrl.length > 100) {
          return logoDataUrl;
        }
      }
    }
  } catch (e) {
    console.log('DOM logo method failed:', e);
  }

  try {
    const response = await fetch('/logo.png', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const logoDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      if (logoDataUrl && logoDataUrl.length > 100) {
        const img = new Image();
        const canvasDataUrl = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
          img.onload = () => {
            clearTimeout(timeout);
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              
              const dataUrl = canvas.toDataURL('image/png');
              if (dataUrl && dataUrl.length > 100) {
                resolve(dataUrl);
              } else {
                reject(new Error('Invalid canvas data'));
              }
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Image load error'));
          };
          img.src = logoDataUrl;
        });
        return canvasDataUrl;
      }
    }
  } catch (e) {
    console.log('Fetch logo method failed:', e);
  }

  try {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    const logoDataUrl = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Logo load timeout'));
      }, 3000);
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const dataUrl = canvas.toDataURL("image/png");
          if (dataUrl && dataUrl.length > 100) {
            resolve(dataUrl);
          } else {
            reject(new Error('Invalid image data'));
          }
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Image load failed'));
      };
      
      img.src = "/logo.png";
    });
    
    return logoDataUrl;
  } catch (e) {
    console.log('Logo image load method 3 failed:', e);
  }
  
  return null;
};

/**
 * Generate PDF for invoice
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 * @returns {Promise<jsPDF>} Generated PDF document
 */
export const generateInvoicePDF = async (invoice, fee = 0) => {
  if (!invoice) {
    throw new Error("Invoice is required");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const darkGray = [17, 24, 39];
  const mediumGray = [75, 85, 99];
  const lightGray = [156, 163, 175];
  const bgGray = [249, 250, 251];
  const borderGray = [229, 231, 235];
  const greenColor = [34, 197, 94];

  let yPos = 20;

  let logoAdded = false;
  const logoSize = 24;
  const logoX = 20;
  const logoY = yPos;
  const logoPadding = 2;

  try {
    const logoDataUrl = await loadLogoImage();
    if (logoDataUrl && logoDataUrl.startsWith('data:image')) {
      try {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(...borderGray);
        pdf.setLineWidth(0.5);
        pdf.rect(logoX, logoY, logoSize, logoSize, "FD");
        pdf.addImage(
          logoDataUrl,
          "PNG",
          logoX + logoPadding,
          logoY + logoPadding,
          logoSize - 2 * logoPadding,
          logoSize - 2 * logoPadding
        );
        logoAdded = true;
        console.log('Logo successfully added to PDF');
      } catch (imgError) {
        console.error('Error adding logo image to PDF:', imgError);
      }
    } else {
      console.log('Logo data URL invalid or empty');
    }
  } catch (e) {
    console.error('Logo loading error:', e);
  }

  if (!logoAdded) {
    pdf.setFillColor(...greenColor);
    pdf.rect(logoX, logoY, logoSize, logoSize, "F");
    pdf.setDrawColor(...greenColor);
    pdf.rect(logoX, logoY, logoSize, logoSize, "D");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("CV", logoX + logoSize/2, logoY + logoSize/2 + 6, { align: "center" });
  }

  const companyNameX = logoX + logoSize + 6;
  const companyNameY = logoY + 11;
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  
  pdf.setTextColor(...greenColor);
  const chainWidth = pdf.getTextWidth("Cha");
  pdf.text("Cha", companyNameX, companyNameY);
  
  pdf.setTextColor(...darkGray);
  const inWidth = pdf.getTextWidth("in");
  pdf.text("in", companyNameX + chainWidth, companyNameY);
  
  pdf.setTextColor(...greenColor);
  pdf.text("voice", companyNameX + chainWidth + inWidth, companyNameY);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Powered by Chainvoice", logoX + logoSize + 6, logoY + 17);

  pdf.setFontSize(19);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkGray);
  pdf.text("INVOICE", 150, yPos + 9);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  const invNumber = invoice.id.toString().padStart(6, "0");
  pdf.text(`#${invNumber}`, 150, yPos + 15);

  const statusText = invoice.isCancelled
    ? "CANCELLED"
    : invoice.isPaid
    ? "PAID"
    : "UNPAID";
  
  if (invoice.isCancelled) {
    pdf.setFillColor(254, 226, 226);
    pdf.setTextColor(220, 38, 38);
  } else if (invoice.isPaid) {
    pdf.setFillColor(220, 252, 231);
    pdf.setTextColor(22, 163, 74);
  } else {
    pdf.setFillColor(254, 243, 199);
    pdf.setTextColor(217, 119, 6);
  }
  
  pdf.rect(150, yPos + 19, 35, 7, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text(statusText, 167.5, yPos + 23.5, { align: "center" });

  pdf.setTextColor(...darkGray);
  yPos += 38;

  pdf.setFillColor(...bgGray);
  pdf.setDrawColor(...borderGray);
  pdf.setLineWidth(0.3);
  pdf.rect(20, yPos, 85, 35, "FD");
  pdf.rect(110, yPos, 85, 35, "FD");

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...mediumGray);
  pdf.text("FROM", 25, yPos + 6);
  pdf.text("BILL TO", 115, yPos + 6);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...darkGray);
  const fromName = `${invoice.user?.fname || ""} ${invoice.user?.lname || ""}`.trim() || "N/A";
  pdf.text(fromName, 25, yPos + 12);
  
  pdf.setFontSize(8);
  pdf.setTextColor(...mediumGray);
  const fromAddress = invoice.user?.address || "N/A";
  pdf.text(fromAddress, 25, yPos + 17, { maxWidth: 75 });
  
  const fromLocation = `${invoice.user?.city || ""}, ${invoice.user?.country || ""}, ${invoice.user?.postalcode || ""}`.trim() || "N/A";
  pdf.text(fromLocation, 25, yPos + 22);
  
  const fromEmail = invoice.user?.email || "N/A";
  pdf.text(fromEmail, 25, yPos + 27);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...darkGray);
  const toName = `${invoice.client?.fname || ""} ${invoice.client?.lname || ""}`.trim() || "N/A";
  pdf.text(toName, 115, yPos + 12);
  
  pdf.setFontSize(8);
  pdf.setTextColor(...mediumGray);
  const toAddress = invoice.client?.address || "N/A";
  pdf.text(toAddress, 115, yPos + 17, { maxWidth: 75 });
  
  const toLocation = `${invoice.client?.city || ""}, ${invoice.client?.country || ""}, ${invoice.client?.postalcode || ""}`.trim() || "N/A";
  pdf.text(toLocation, 115, yPos + 22);
  
  const toEmail = invoice.client?.email || "N/A";
  pdf.text(toEmail, 115, yPos + 27);

  yPos += 42;

  pdf.setFillColor(...bgGray);
  pdf.setDrawColor(...borderGray);
  pdf.setLineWidth(0.3);
  pdf.rect(20, yPos, 170, 25, "FD");
  
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("PAYMENT CURRENCY", 25, yPos + 7);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const tokenName = invoice.paymentToken?.name || "Ether";
  const tokenSymbol = invoice.paymentToken?.symbol || "ETH";
  pdf.text(`${tokenName} (${tokenSymbol})`, 25, yPos + 14);

  pdf.setFontSize(8);
  pdf.setTextColor(...mediumGray);
  if (invoice.paymentToken?.address) {
    const contractAddr = invoice.paymentToken.address;
    const shortAddr = `${contractAddr.substring(0, 10)}......${contractAddr.substring(contractAddr.length - 8)}`;
    pdf.text(shortAddr, 25, yPos + 19);
    const chainId = invoice.paymentToken?.chainId || invoice.chainId;
    const network = getWagmiChainInfo(chainId);
    const chainName = network?.name || getWagmiChainName(chainId) || "Unknown network";
    pdf.text(
      `Decimals: ${invoice.paymentToken.decimals || 18} | Chain: ${chainName}`,
      120,
      yPos + 14
    );
  } else {
    pdf.text("Native Currency", 25, yPos + 19);
  }

  yPos += 30;

  pdf.setFillColor(...bgGray);
  pdf.rect(20, yPos, 170, 8, "FD");
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const issueDate = new Date(invoice.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  pdf.text(`Issued: ${issueDate}`, 25, yPos + 5.5);
  pdf.text(`Due: ${dueDate}`, 160, yPos + 5.5);

  yPos += 12;

  const colPositions = {
    description: 25,
    qty: 90,
    price: 108,
    discount: 132,
    tax: 148,
    amount: 175
  };
  
  const headers = ["DESCRIPTION", "QTY", "PRICE", "DISCOUNT", "TAX", "AMOUNT"];
  const headerPositions = [
    colPositions.description, 
    colPositions.qty, 
    colPositions.price, 
    colPositions.discount, 
    colPositions.tax, 
    colPositions.amount
  ];

  const rowHeight = 10;
  const headerHeight = 10;
  let tableStartY = yPos;
  let tableEndY = tableStartY + headerHeight;

  pdf.setDrawColor(...borderGray);
  pdf.setLineWidth(0.5);
  pdf.rect(20, yPos, 170, headerHeight, "D");
  
  pdf.setFillColor(...darkGray);
  pdf.rect(20, yPos, 170, headerHeight, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  
  headers.forEach((header, index) => {
    const align = index === 0 ? "left" : "right";
    pdf.text(header, headerPositions[index], yPos + 7, { align });
  });
  
  yPos += headerHeight;

  pdf.setTextColor(...darkGray);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  if (invoice.items && invoice.items.length > 0) {
    invoice.items.forEach((item, index) => {
      if (yPos > 250) {
        pdf.setDrawColor(...borderGray);
        pdf.setLineWidth(0.5);
        pdf.line(20, yPos, 190, yPos);
        pdf.line(20, tableStartY, 20, yPos);
        pdf.line(190, tableStartY, 190, yPos);
        
        pdf.addPage();
        yPos = 20;
        tableStartY = yPos;
        
        pdf.setDrawColor(...borderGray);
        pdf.setLineWidth(0.5);
        pdf.rect(20, yPos, 170, headerHeight, "D");
        pdf.setFillColor(...darkGray);
        pdf.rect(20, yPos, 170, headerHeight, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        headers.forEach((header, idx) => {
          const align = idx === 0 ? "left" : "right";
          pdf.text(header, headerPositions[idx], yPos + 7, { align });
        });
        yPos += headerHeight;
      }

      pdf.setDrawColor(...borderGray);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos, 190, yPos);

      const unitPriceStr = String(item.unitPrice || "");
      const unitPriceDisplay = unitPriceStr.includes(tokenSymbol) 
        ? unitPriceStr 
        : `${item.unitPrice || 0} ${tokenSymbol}`;

      pdf.setTextColor(...darkGray);
      pdf.text(item.description || "N/A", colPositions.description, yPos + 6, { maxWidth: 65 });
      pdf.text(String(item.qty || 0), colPositions.qty, yPos + 6, { align: "right" });
      pdf.text(unitPriceDisplay, colPositions.price, yPos + 6, { align: "right" });
      pdf.text(String(item.discount || "0"), colPositions.discount, yPos + 6, { align: "right" });
      pdf.text(String(item.tax || "0%"), colPositions.tax, yPos + 6, { align: "right" });
      
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${item.amount || 0} ${tokenSymbol}`,
        colPositions.amount,
        yPos + 6,
        { align: "right" }
      );
      pdf.setFont("helvetica", "normal");
      
      yPos += rowHeight;
      tableEndY = yPos;
    });
    
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.5);
    pdf.line(20, tableEndY, 190, tableEndY);
    pdf.line(20, tableStartY, 20, tableEndY);
    pdf.line(190, tableStartY, 190, tableEndY);
  } else {
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.5);
    pdf.rect(20, yPos, 170, rowHeight, "D");
    pdf.text("No items in this invoice", 25, yPos + 6);
    yPos += rowHeight;
    tableEndY = yPos;
  }

  yPos += 5;

  pdf.setFillColor(...bgGray);
  pdf.setDrawColor(...borderGray);
  pdf.setLineWidth(0.3);
  pdf.rect(20, yPos, 170, 28, "FD");

  pdf.setTextColor(...darkGray);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");

  pdf.text("Subtotal:", 25, yPos + 7);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `${invoice.amountDue} ${tokenSymbol}`,
    185,
    yPos + 7,
    { align: "right" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.text("Network Fee:", 25, yPos + 13);
  pdf.setFont("helvetica", "bold");
  const networkFee = ethers.formatUnits(fee);
  pdf.text(`${networkFee} ETH`, 185, yPos + 13, { align: "right" });

  pdf.setDrawColor(...mediumGray);
  pdf.setLineWidth(0.5);
  pdf.line(25, yPos + 19, 185, yPos + 19);

  pdf.setFillColor(250, 250, 250);
  pdf.rect(20, yPos + 19, 170, 9, "F");
  pdf.setDrawColor(...borderGray);
  pdf.rect(20, yPos + 19, 170, 9, "D");

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkGray);
  pdf.text("TOTAL AMOUNT:", 25, yPos + 25);

  const totalText =
    tokenSymbol === "ETH"
      ? `${(parseFloat(invoice.amountDue) + parseFloat(networkFee)).toFixed(6)} ETH`
      : `${invoice.amountDue} ${tokenSymbol} + ${networkFee} ETH`;

  pdf.setFontSize(11);
  pdf.text(totalText, 185, yPos + 25, { align: "right" });

  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(20, 280, 190, 280);
    
    pdf.setFontSize(7);
    pdf.setTextColor(...lightGray);
    pdf.setFont("helvetica", "normal");
    
    pdf.text(
      `Page ${i} of ${pageCount}`,
      105,
      287,
      { align: "center" }
    );
    
    pdf.setFontSize(7);
    pdf.setTextColor(...mediumGray);
    pdf.text(
      "Generated by Chainvoice",
      105,
      292,
      { align: "center" }
    );
    
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.setFontSize(6);
    pdf.setTextColor(...lightGray);
    pdf.text(
      `Generated on ${currentDate}`,
      105,
      297,
      { align: "center" }
    );
  }

  return pdf;
};

