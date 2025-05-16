import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, ArrowLeft } from "lucide-react";

interface PaymentFormProps {
  totalAmount: number;
  onPaymentComplete: () => void;
  onBack: () => void;
}

const PaymentForm = ({
  totalAmount,
  onPaymentComplete,
  onBack,
}: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">(
    "mobile",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Payment</h2>
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-primary">
          UGX {totalAmount.toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Select Payment Method</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              setPaymentMethod(value as "card" | "mobile")
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile" id="mobile" />
              <Label
                htmlFor="mobile"
                className="flex items-center cursor-pointer"
              >
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                Mobile Money
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label
                htmlFor="card"
                className="flex items-center cursor-pointer"
              >
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Credit/Debit Card
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "mobile" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Mobile Money Provider</Label>
              <Select defaultValue="mtn">
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0770123456"
                required
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full py-6" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : (
            "Complete Payment"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
