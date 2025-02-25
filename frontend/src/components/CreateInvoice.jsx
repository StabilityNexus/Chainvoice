import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import { ChainvoiceABI } from '../contractsABI/ChainvoiceABI';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Label } from './ui/label';
import { parseUnits } from 'viem';

function CreateInvoice() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const account = useAccount();
  const [dueDate, setDueDate] = useState();
  const [issueDate, setIssueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const createInvoiceRequest = async (data) => {
    if (!isConnected || !walletClient) {
      alert("Please connect your wallet");
      return;
    }
  
    try {
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );
      const sanitizedItemData = data.itemData.map((item) => ({
        ...item,
        qty: item.qty ? String(item.qty) : "0",
        unitPrice: item.unitPrice ? ethers.parseUnits(String(item.unitPrice),18): "0",
        discount: item.discount ? String(item.discount) : "0",
        tax: item.tax ? String(item.tax) : "0",
        amount: item.amount ? String(item.amount) : "0",
      }));
      const res = await contract.createInvoice(
        ethers.parseUnits(String(totalAmountDue),18),
        data.clientAddress,
        [
          data.userFname,
          data.userLname,
          data.userEmail,
          data.userCountry,
          data.userCity,
          data.userPostalcode,
        ],
        [
          data.clientFname,
          data.clientLname,
          data.clientEmail,
          data.clientCountry,
          data.clientCity,
          data.clientPostalcode,
        ],
        sanitizedItemData
      );
  
      console.log("Transaction successful", res);
    } catch (error) {
      console.error("Invoice creation error:", error);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };
  

  const [itemData, setItemData] = useState([{
    description: '',
    qty: '',
    unitPrice: '',
    discount: '',
    tax: '',
    amount: ''
  }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // User detail
    const userAddress = formData.get("userAddress");
    const userFname = formData.get("userFname");
    const userLname = formData.get("userLname");
    const userEmail = formData.get("userEmail");
    const userCountry = formData.get("userCountry");
    const userCity = formData.get("userCity");
    const userPostalcode = formData.get("userPostalcode");

    // Client detail
    const clientAddress = formData.get("clientAddress");
    const clientFname = formData.get("clientFname");
    const clientLname = formData.get("clientLname");
    const clientEmail = formData.get("clientEmail");
    const clientCountry = formData.get("clientCountry");
    const clientCity = formData.get("clientCity");
    const clientPostalcode = formData.get("clientPostalcode");

    const data = {
      userAddress,
      userFname,
      userLname,
      userEmail,
      userCountry,
      userCity,
      userPostalcode,
      clientAddress,
      clientFname,
      clientLname,
      clientEmail,
      clientCountry,
      clientCity,
      clientPostalcode,
      itemData
    };
    console.log(data);
    createInvoiceRequest(data);
  };

  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const handleItemData = (e, index) => {
    const { name, value } = e.target;

    setItemData((prevItemData) =>
      prevItemData.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addItem = () => {
    setItemData((prev) => [...prev, {
      description: '',
      qty: '',
      unitPrice: '',
      discount: '',
      tax: '',
      amount: '',
    }]);
    console.log(itemData.length);
  };

  useEffect(() => {
    let total = itemData.reduce((sum, item) => {
      return sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0) - (parseFloat(item.discount) || 0) + (parseFloat(item.tax) || 0));
    }, 0);

    setTotalAmountDue(total);
  }, [itemData]);

  return (
    <div className='font-Inter'>
      <h2 className="text-xl font-bold mb-7">Create New Invoice Request</h2>
      <div className="flex items-center space-x-2">
        <Label className='text-lg'>Invoice # </Label>
        <Input value='1' className='w-48' />
        <p> Issued Date </p>
        <Button
          variant={"outline"}
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !issueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {format(issueDate, "PPP")}
        </Button>

        <p> Due Date </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex space-x-2'>

          <div className='border max-w-[550px] p-5 my-3 rounded-md'>
            <p className='my-2'>From (Your Information)</p>
            <Input value={account?.address} className='w-[500px]' name="userAddress" />
            <div className='mt-4'>
              <p className='text-gray-500 text-sm my-4'>Add Your Info</p>
              <div className='flex space-x-4'>
                <Input type='text' placeholder='Your First Name' className='w-[500px]' name="userFname" />
                <Input type='text' placeholder='Your Last Name' className='w-[500px]' name="userLname" />
              </div>

              <div className='flex space-x-4 my-5'>
                <Input type='email' placeholder='Email' className='w-[500px]' name="userEmail" />
                <Input type='text' placeholder='Country' className='w-[500px]' name="userCountry" />
              </div>
              <div className='flex space-x-4 my-5'>
                <Input type='text' placeholder='City' className='w-[500px]' name="userCity" />
                <Input type='text' placeholder='Postal Code' className='w-[500px]' name="userPostalcode" />
              </div>
            </div>
          </div>

          <div className='border max-w-[550px] p-5 my-3 rounded-md'>
            <p className='my-2'>Client Information</p>
            <Input placeholder='Client Wallet Address' className='w-[500px]' name="clientAddress" />
            <div className='mt-4'>
              <p className='text-gray-500 text-sm my-4'>Add Client Info</p>
              <div className='flex space-x-4'>
                <Input type='text' placeholder='Client First Name' className='w-[500px]' name="clientFname" />
                <Input type='text' placeholder='Client Last Name' className='w-[500px]' name="clientLname" />
              </div>

              <div className='flex space-x-4 my-5'>
                <Input type='email' placeholder='Email' className='w-[500px]' name="clientEmail" />
                <Input type='text' placeholder='Country' className='w-[500px]' name="clientCountry" />
              </div>
              <div className='flex space-x-4 my-5'>
                <Input type='text' placeholder='City' className='w-[500px]' name="clientCity" />
                <Input type='text' placeholder='Postal Code' className='w-[500px]' name="clientPostalcode" />
              </div>
            </div>
          </div>
        </div>

        <div className=''>
          <div className='grid grid-cols-12 justify-center text-center bg-green-500 py-3 rounded-t-md '>
            <div className='col-span-4 '>DESCRIPTION</div>
            <div className='col-span-1 '>QTY</div>
            <div className='col-span-2 '>UNIT PRICE</div>
            <div className='col-span-1 '>DISCOUNT</div>
            <div className='col-span-1 '>TAX(%)</div>
            <div className='col-span-3 '>AMOUNT</div>
          </div>
          <div className="border p-3 rounded-b-md" >
            {
              itemData
                .map((_, index) => (
                  <div className="grid grid-cols-12 gap-3 my-2" key={index} >
                    <Input type="text" placeholder="Enter Description" className="col-span-4 py-5" name="description" onChange={(e) => handleItemData(e, index)} />
                    <Input type="number" placeholder="0" className="col-span-1 py-5" name="qty" onChange={(e) => handleItemData(e, index)} />
                    <Input type="text" placeholder="0" className="col-span-2 py-5" name="unitPrice" onChange={(e) => handleItemData(e, index)} />
                    <Input type="text" placeholder="0" className="col-span-1 py-5" name="discount" onChange={(e) => handleItemData(e, index)} />
                    <Input type="text" placeholder="0" className="col-span-1 py-5" name="tax" onChange={(e) => handleItemData(e, index)} />
                    <Input type="text" placeholder="0.00" className="col-span-3 py-5" name="amount" disabled value={
                      (parseFloat(itemData[index].qty) || 0) * (parseFloat(itemData[index].unitPrice) || 0) - (parseFloat(itemData[index].discount) || 0) + (parseFloat(itemData[index].tax) || 0)
                    }
                    />
                  </div>
                ))
            }
          </div>
          <p className='text-right mr-20'>Total : {totalAmountDue}</p>
          <div className='flex justify-between items-center'>
            <Button className='my-2' onClick={addItem} type="button"> <span className='text-xl'>+</span> Add Item</Button>
            <Button className='mx-7' type="submit">Create Invoice</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateInvoice

