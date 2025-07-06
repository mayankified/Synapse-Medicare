"use client";

import { useState } from "react";
import { FileText, Loader2, UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MedicalReport() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisData(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:8000/analyze-report", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to analyze the report");

            const data = await response.json();

            if (!data || typeof data !== "object") {
                throw new Error("Invalid response format");
            }

            setAnalysisData(data);
            console.log("API Response:", data); // Debugging Step
            alert("Report analyzed successfully!");
        } catch (error) {
            console.error(error);
            setError("Error analyzing the report. Please try again.");
            alert("Failed to analyze the report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
            <Card className="w-full max-w-3xl shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-500" />
                        Upload & Analyze Medical Report
                    </CardTitle>
                    <CardDescription>
                        Upload your medical report (PDF or Image) and get an AI-powered analysis.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    
                    <div className="flex flex-col items-center gap-4">
                        <Input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={handleFileChange}
                            className="border border-gray-300 p-3 rounded-lg w-full cursor-pointer"
                        />
                        <Button
                            onClick={handleUpload}
                            disabled={isLoading || !file}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                            {isLoading ? "Analyzing..." : "Upload & Analyze"}
                        </Button>
                    </div>

                    
                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}

                    
                    {analysisData && (
                        <div className="space-y-6">
                            
                            {analysisData.extracted_text && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>🔍 Extracted Report Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Test</TableHead>
                                                    <TableHead>Result</TableHead>
                                                    <TableHead>Reference Range</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {analysisData.extracted_text
                                                    ?.split("\n")
                                                    ?.filter((line: any) => line.includes("("))
                                                    ?.map((line: any, index: any) => {
                                                        const parts = line.split(/\s+/);
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{parts[0] || "N/A"}</TableCell>
                                                                <TableCell>{parts[1] || "N/A"}</TableCell>
                                                                <TableCell>{parts.slice(2).join(" ") || "N/A"}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}

                            
                            {analysisData?.medical_insights?.key_terms?.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>📌 Key Medical Terms</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisData.medical_insights.key_terms.map((term: string, index: any) => (
                                                <Badge key={index} variant="secondary">{term}</Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            
                            {Array.isArray(analysisData?.medical_insights?.possible_conditions) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>⚠️ Possible Health Concerns</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {analysisData.medical_insights.possible_conditions.map((condition: any, index: number) => (
                                            <div key={index} className="p-3 border-b last:border-none">
                                                <h3 className="text-lg font-semibold">{condition?.condition || "Unknown Condition"}</h3>
                                                <p className="text-gray-700">{condition?.implication || "No implication provided"}</p>
                                                {Array.isArray(condition?.tests) && condition.tests.length > 0 ? (
                                                    <Badge variant="outline" className="mt-2">
                                                        Tests Considered: {condition.tests.join(", ")}
                                                    </Badge>
                                                ) : (
                                                    <p className="text-gray-500">No test data available</p>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            
                            {Array.isArray(analysisData?.medical_insights?.advice) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>🩺 Medical Advice</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            {analysisData.medical_insights.advice.map((advice: string, index: number) => (
                                                <li key={index}>{advice}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
