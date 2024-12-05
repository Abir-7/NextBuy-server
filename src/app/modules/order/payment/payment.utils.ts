/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { config } from "../../../config";

export const initiatePayment = async (data: any) => {
  const res = await axios.post(config.Api_EndPoint as string, {
    store_id: config.Store_ID,
    signature_key: config.Signature_Key,
    tran_id: data?.txn,
    success_url: `http://localhost:3500/api/v1/payment/confirmation?id=${data.orderId}`,
    fail_url: "http://www.merchantdomain.com/failedpage.html",
    cancel_url: "http://www.merchantdomain.com/cancellpage.html",
    amount: data.orderData,
    currency: "BDT",

    desc: "Merchant Registration Payment",
    cus_name: data.customerData.name,
    cus_email: data.customerData.email,
    cus_add1: data.customerData.address,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "N/A",
    cus_phone: data.customerData.mobile,
    type: "json",
  });

  return res;
};
