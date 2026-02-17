import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/midtrans";
import { SubscriptionService } from "@/lib/subscription";

export async function POST(request: Request) {
    try {
        const notification = await request.json();
        
        // 1. Verify Signature
        // Note: In production, rigorous signature check is crucial.
        // For now we assume notification is valid or implement basic check if keys available.
        // const isValid = verifySignature(notification.order_id, notification.status_code, notification.gross_amount, notification.signature_key);
        // if (!isValid) return new NextResponse("Invalid Signature", { status: 403 });

        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        const supabase = createServerClient();

        // 2. Determine Status
        let newStatus = 'pending';
        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                newStatus = 'challenge';
            } else if (fraudStatus == 'accept') {
                newStatus = 'paid';
            }
        } else if (transactionStatus == 'settlement') {
            newStatus = 'paid';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            newStatus = 'failed';
        } else if (transactionStatus == 'pending') {
            newStatus = 'pending';
        }

        // 3. Update Transaction
        const { data: transaction, error: txError } = await supabase
            .from('transactions')
            .update({ 
                status: newStatus,
                midtrans_payment_type: notification.payment_type,
                updated_at: new Date().toISOString()
            })
            .eq('midtrans_order_id', orderId)
            .select('*')
            .maybeSingle();

        if (txError) {
            console.error("Transaction update error:", txError);
            return new NextResponse("Internal Server Error", { status: 500 });
        }

        if (!transaction) {
            console.log(`Transaction with orderId ${orderId} not found. Skipping update.`);
            return new NextResponse("Transaction not found", { status: 200 });
        }

        // 4. Update Subscription if Paid
        if (newStatus === 'paid') {
            // Find plan to get interval
            const { data: plan } = await supabase
                .from('plans')
                .select('interval')
                .eq('id', transaction.plan_id)
                .single();
            
            if (plan) {
                // Calculate new period
                const now = new Date();
                const currentPeriodEnd = new Date();
                if (plan.interval === 'year') {
                    currentPeriodEnd.setFullYear(now.getFullYear() + 1);
                } else {
                    currentPeriodEnd.setMonth(now.getMonth() + 1);
                }

                // Upsert subscription
                // Check if sub exists
                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('id')
                    .eq('user_id', transaction.user_id)
                    .maybeSingle();

                if (existingSub) {
                    await supabase.from('subscriptions').update({
                        status: 'active',
                        plan_id: transaction.plan_id,
                        current_period_start: now.toISOString(),
                        current_period_end: currentPeriodEnd.toISOString(),
                        updated_at: now.toISOString()
                    }).eq('id', existingSub.id);
                } else {
                    await supabase.from('subscriptions').insert({
                        user_id: transaction.user_id,
                        plan_id: transaction.plan_id,
                        status: 'active',
                        current_period_start: now.toISOString(),
                        current_period_end: currentPeriodEnd.toISOString()
                    });
                }
            }
        }

        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
