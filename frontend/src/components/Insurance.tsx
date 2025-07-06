"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Hospital, Filter, Search,  X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Sample insurance plans
const insurancePlans = [
    {
        id: 1,
        name: "Apollo Munich Easy Health",
        provider: "Apollo Munich",
        premium: "₹5,500 / year",
        coverage: "₹10 Lakhs",
        hospitals: 9000,
        affiliatedHospitals: ["Fortis Hospital", "Apollo", "AIIMS", "Narayana Health"],
        conditions: ["Pre & Post Hospitalization", "Maternity Cover", "OPD Cover"],
        waitingPeriod: "2 years for pre-existing diseases",
        criticalIllness: "Covered up to ₹5 Lakhs",
    },
    {
        id: 2,
        name: "HDFC Ergo Health Suraksha",
        provider: "HDFC Ergo",
        premium: "₹7,200 / year",
        coverage: "₹15 Lakhs",
        hospitals: 12000,
        affiliatedHospitals: ["Max Healthcare", "Medanta", "AIIMS", "Manipal Hospitals"],
        conditions: ["Cashless Treatment", "Critical Illness Cover", "Daycare Cover"],
        waitingPeriod: "3 years for pre-existing diseases",
        criticalIllness: "Covered up to ₹7 Lakhs",
    },
    {
        id: 3,
        name: "Max Bupa Health Recharge",
        provider: "Max Bupa",
        premium: "₹6,800 / year",
        coverage: "₹12 Lakhs",
        hospitals: 8500,
        affiliatedHospitals: ["Apollo", "Fortis", "Columbia Asia", "Narayana Health"],
        conditions: ["No-Claim Bonus", "Annual Health Checkup", "Pre-Existing Disease Cover"],
        waitingPeriod: "1 year for pre-existing diseases",
        criticalIllness: "Covered up to ₹6 Lakhs",
    },
];

export default function HealthInsurance() {
    const [search, setSearch] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const filteredPlans = insurancePlans.filter((plan) =>
        plan.name.toLowerCase().includes(search.toLowerCase()) ||
        plan.provider.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative flex flex-col min-h-screen p-6">
            
            <h1 className="text-4xl font-bold text-b mb-6 text-center">
                🏥 Health Insurance Plans
            </h1>
            <p className="text-lg italic text-gray-600 text-center mb-6">
                Compare the best health insurance plans with cashless hospitalization, critical illness coverage, and affiliated hospitals.
            </p>

            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-600" />
                    <Input
                        placeholder="Search for insurance plans..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-72"
                    />
                </div>

                <Button variant="outline" className="gap-2">
                    <Filter className="w-5 h-5" />
                    Apply Filters
                </Button>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="shadow-md hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-col items-start">
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription className="text-gray-500">{plan.provider}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-lg font-semibold text-blue-600">{plan.premium}</p>
                            <p className="text-gray-700">Coverage: {plan.coverage}</p>
                            <p className="text-gray-700 flex items-center gap-2">
                                <Hospital className="w-5 h-5 text-red-500" />
                                {plan.hospitals}+ Hospitals
                            </p>
                            <ul className="list-disc list-inside text-gray-600">
                                {plan.conditions.map((condition, index) => (
                                    <li key={index}>{condition}</li>
                                ))}
                            </ul>
                            <Button
                                className="w-full mt-4 hover:bg-gray-600 text-white"
                                onClick={() => setSelectedPlan(plan)}
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            
            {selectedPlan && (
                <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
                    <DialogContent className="max-w-lg bg-white shadow-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{selectedPlan.name}</DialogTitle>
                            <p className="text-gray-600">{selectedPlan.provider}</p>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-lg font-semibold text-blue-600">{selectedPlan.premium}</p>
                            <p><strong>Coverage:</strong> {selectedPlan.coverage}</p>
                            <p><strong>Waiting Period:</strong> {selectedPlan.waitingPeriod}</p>
                            <p><strong>Critical Illness Coverage:</strong> {selectedPlan.criticalIllness}</p>
                            
                            <h3 className="text-lg font-semibold">Affiliated Hospitals</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {selectedPlan.affiliatedHospitals.map((hospital: string, index: number) => (
                                    <li key={index}>{hospital}</li>
                                ))}
                            </ul>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                                <X className="h-5 w-5" /> Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            
            <div className="w-full  mx-auto mt-12">
                <h2 className="text-2xl font-bold mb-4">📌 Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="faq1">
                        <AccordionTrigger>What does health insurance cover?</AccordionTrigger>
                        <AccordionContent>
                            Health insurance typically covers hospitalization, surgeries, critical illness, maternity benefits, and preventive health checkups.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq2">
                        <AccordionTrigger>Is pre-existing disease covered?</AccordionTrigger>
                        <AccordionContent>
                            Some policies cover pre-existing diseases after a waiting period.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
