import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createTransaction } from "@/lib/midtrans";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { planId } = body;

        const supabase = createServerClient();

        // 1. Fetch Plan
        const { data: plan } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (!plan) return new NextResponse("Plan not found", { status: 404 });

        // 2. Fetch Exchange Rate
        const { data: setting } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'exchange_rate')
            .single();

        const rate = setting?.value?.rate || 16000;
        const amountIdr = Math.ceil(plan.price * rate);

        // 3. Create Transaction Record
        const orderId = `ORDER-${uuidv4()}`; // Unique Order ID
        
        const { error: dbError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                plan_id: plan.id,
                amount_usd: plan.price,
                amount_idr: amountIdr,
                exchange_rate: rate,
                status: 'pending',
                midtrans_order_id: orderId
            });

        if (dbError) {
            console.error("DB Error:", dbError);
            throw new Error("Failed to create transaction record");
        }

        // 4. Call Midtrans
        const midtransTx = await createTransaction({
            orderId: orderId,
            amount: amountIdr,
            customerDetails: {
                firstName: user.name || 'User',
                email: user.email
            },
            itemDetails: [
                {
                    id: plan.id,
                    price: amountIdr,
                    quantity: 1,
                    name: `Subscription: ${plan.name}`
                }
            ]
        });

        // 5. Update Transaction with Token
        await supabase
            .from('transactions')
            .update({ midtrans_token: midtransTx.token })
            .eq('midtrans_order_id', orderId);

        return NextResponse.json({
            token: midtransTx.token,
            redirect_url: midtransTx.redirect_url,
            amount_idr: amountIdr,
            rate: rate
        });

    } catch (error: any) {
        console.error("Payment Error:", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
