"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ExternalLink } from "lucide-react";

import schemeDetailsJson from "./schemes.json";

export default function RecommendHealthInsurance() {
    const [formData, setFormData] = useState({
        age: "",
        income: "",
        employment_type: "",
        bank_account: "",
        socio_status: "",
        family_size: "",
    });

    const [loading, setLoading] = useState(false);
    const [schemeDetails, setSchemeDetails] = useState<any | null>(null);
    console.log(schemeDetailsJson);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSchemeDetails(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    age: parseInt(formData.age),
                    income: parseInt(formData.income),
                    employment_type: formData.employment_type,
                    bank_account: formData.bank_account,
                    socio_status: formData.socio_status,
                    family_size: parseInt(formData.family_size),
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch recommendation");

            const data = await response.json();
            const recommendedSchemeCode = data["Recommended Scheme"];
            // @ts-ignore
            setSchemeDetails(schemeDetailsJson[recommendedSchemeCode] || null);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch recommendation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 ">
            <Card className="w-full max-w-2xl shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold  text-center">
                        🏥 Government Scheme Recommendation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                        <Input name="income" type="number" placeholder="Income (₹)" value={formData.income} onChange={handleChange} required />

                        <Select onValueChange={(value) => handleSelectChange("employment_type", value)}>
                            <SelectTrigger><SelectValue placeholder="Employment Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Government">Government</SelectItem>
                                <SelectItem value="Unorganized">Unorganized</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleSelectChange("bank_account", value)}>
                            <SelectTrigger><SelectValue placeholder="Bank Account Availability" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleSelectChange("socio_status", value)}>
                            <SelectTrigger><SelectValue placeholder="Socio-Economic Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BPL">Below Poverty Line (BPL)</SelectItem>
                                <SelectItem value="Non-BPL">Non-Below Poverty Line (APL)</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input name="family_size" type="number" placeholder="Family Size" value={formData.family_size} onChange={handleChange} required />
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Recommended Plan"}
                    </Button>

                    {schemeDetails && (
                        <Card className="mt-6 bg-gray-100">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-green-600">{schemeDetails.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{schemeDetails.short_description}</p>
                                <p className="mt-2 text-sm text-gray-600">{schemeDetails.long_description}</p>
                                <a
                                    href={schemeDetails.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center text-blue-500 hover:underline"
                                >
                                    Visit Website <ExternalLink className="w-4 h-4 ml-1" />
                                </a>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
