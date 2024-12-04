import React, { useState, useEffect } from "react";
import { medicApi } from "../services/medicApi";

function Symptoms() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await medicApi.getSymptoms();
        setSymptoms(data);
      } catch (err) {
        setError("Failed to load symptoms. Please try again later.");
        console.error("Error loading symptoms:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSymptoms();
  }, []);

  const handleSymptomSelect = (symptomId) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((id) => id !== symptomId);
      }
      return [...prev, symptomId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const diagnosisResults = await medicApi.getDiagnosis(
        selectedSymptoms,
        gender.toLowerCase(),
        yearOfBirth
      );

      // Get additional information for each diagnosis
      const detailedResults = await Promise.all(
        diagnosisResults.map(async (result) => {
          try {
            const details = await medicApi.getIssueInfo(result.Issue.ID);
            return {
              ...result,
              details,
            };
          } catch (err) {
            console.error("Error fetching issue details:", err);
            return result;
          }
        })
      );

      setResults(detailedResults);
    } catch (err) {
      setError("Failed to get diagnosis. Please try again.");
      console.error("Diagnosis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Symptom Checker
          </h1>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year of Birth
                </label>
                <input
                  type="number"
                  value={yearOfBirth}
                  onChange={(e) => setYearOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Symptoms
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom.ID}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom.ID)}
                      onChange={() => handleSymptomSelect(symptom.ID)}
                      className="rounded text-red-400"
                    />
                    <span>{symptom.Name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !yearOfBirth ||
                !gender ||
                selectedSymptoms.length === 0
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Check Symptoms"}
            </button>
          </form>

          {results && results.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Possible Conditions
              </h2>
              {results.map((result) => (
                <div
                  key={result.Issue.ID}
                  className="mb-4 p-3 bg-gray-50 rounded"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-lg">{result.Issue.Name}</p>
                    <span className="text-sm font-medium">
                      Accuracy: {Math.round(result.Issue.Accuracy)}%
                    </span>
                  </div>
                  {result.details && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Description:</strong>{" "}
                        {result.details.Description}
                      </p>
                      <p className="mt-1">
                        <strong>Medical Condition:</strong>{" "}
                        {result.details.MedicalCondition}
                      </p>
                      <p className="mt-1">
                        <strong>Treatment:</strong>{" "}
                        {result.details.TreatmentDescription}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  Important Notice
                </p>
                <p className="text-sm text-yellow-700">
                  This is not a medical diagnosis. The results are provided for
                  informational purposes only and should not replace
                  professional medical advice. Always consult with a qualified
                  healthcare provider for proper medical evaluation and
                  treatment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Symptoms;
