// lib/midtrans.ts (Using Fetch API directly)

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions' 
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export interface TransactionParams {
    orderId: string;
    amount: number; // IDR
    customerDetails?: {
        firstName: string;
        email: string;
    };
    itemDetails?: {
        id: string;
        price: number;
        quantity: number;
        name: string;
    }[];
}

export const createTransaction = async (params: TransactionParams) => {
    const payload = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: Math.round(params.amount)
        },
        credit_card: {
            secure: true
        },
        customer_details: {
            first_name: params.customerDetails?.firstName,
            email: params.customerDetails?.email,
        },
        item_details: params.itemDetails
    };

    const auth = Buffer.from(`${SERVER_KEY}:`).toString('base64');

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Midtrans API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data; // { token: "...", redirect_url: "..." }
    } catch (error) {
        console.error("Midtrans Service Error:", error);
        throw error;
    }
};

export const verifySignature = (orderId: string, statusCode: string, grossAmount: string, signatureKey: string) => {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha512');
    const data = orderId + statusCode + grossAmount + SERVER_KEY;
    hash.update(data);
    const signature = hash.digest('hex');
    return signature === signatureKey;
}
