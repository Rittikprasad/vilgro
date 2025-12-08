import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/Card";
import type { QuestionChoiceItem, QuestionItem } from "../../roles/Admin/components/QuestionSection/QuestionListTable";
import SingleChoiceQuestion from "../ui/question/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../ui/question/MultipleChoiceQuestion";
import SliderQuestion from "../ui/question/SliderQuestion";
import StarRatingQuestion from "../ui/question/StarRatingQuestion";
import VisualRatingQuestion from "../ui/question/VisualRatingQuestion";
import BackIcon from "../../assets/svg/BackIcon.svg";
import Navbar from "../ui/Navbar";

interface QuestionResponse extends QuestionItem {
  selectedValue?: string;
  selectedValues?: string[];
  sliderValue?: number;
  dimensionValues?: Record<string, number>;
  ratingValue?: number;
  npsValue?: number;
}

const slugifyLabel = (value: string): string => value.toLowerCase().replace(/\s+/g, "_");

const getChoiceMeta = (choice: string | QuestionChoiceItem) => {
  if (typeof choice === "string") {
    const slug = slugifyLabel(choice);
    return { label: choice, value: slug };
  }

  return {
    label: choice.label,
    value: choice.value || slugifyLabel(choice.label),
  };
};

const formatChoiceOptions = (choices?: Array<string | QuestionChoiceItem>) =>
  (choices || []).map((choice) => {
    const meta = getChoiceMeta(choice);
    return { label: meta.label, value: meta.value };
  });

const noop = () => {};

// Dummy data for assessment responses
// TODO: Replace with actual API integration
const generateDummyResponses = (assessmentId: string): QuestionResponse[] => {
  return [
    {
      id: 1,
      order: 1,
      question: "What is your organization's primary focus sector?",
      type: "single-choice",
      weight: 10,
      status: "Active",
      options: {
        type: "single-choice",
        choices: [
          { label: "Agriculture", value: "agriculture" },
          { label: "Healthcare", value: "healthcare" },
          { label: "Education", value: "education" },
          { label: "Waste Management", value: "waste_management" },
        ],
      },
      selectedValue: "agriculture",
    },
    {
      id: 2,
      order: 2,
      question: "Which of the following impact areas does your organization address?",
      type: "Multi-select",
      weight: 15,
      status: "Active",
      options: {
        type: "multiple-choice",
        choices: [
          { label: "Environmental Impact", value: "environmental_impact" },
          { label: "Social Impact", value: "social_impact" },
          { label: "Economic Impact", value: "economic_impact" },
          { label: "Health Impact", value: "health_impact" },
        ],
      },
      selectedValues: ["environmental_impact", "social_impact"],
    },
    {
      id: 3,
      order: 3,
      question: "Rate your organization's financial stability on a scale of 0-100",
      type: "Slider",
      weight: 20,
      status: "Active",
      options: {
        min: 0,
        max: 100,
        step: 1,
      },
      sliderValue: 75,
    },
    {
      id: 4,
      order: 4,
      question: "How would you rate your organization's impact measurement capabilities?",
      type: "RATING",
      weight: 15,
      status: "Active",
      options: {
        maxStars: 5,
        labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
      },
      ratingValue: 4,
    },
    {
      id: 5,
      order: 5,
      question: "Rate the following dimensions of your organization:",
      type: "Multi-Slider",
      weight: 25,
      status: "Active",
      options: {
        dimensions: [
          { code: "dimension1", label: "Operational Efficiency", min_value: 0, max_value: 100 },
          { code: "dimension2", label: "Market Reach", min_value: 0, max_value: 100 },
          { code: "dimension3", label: "Innovation Capacity", min_value: 0, max_value: 100 },
        ],
      },
      dimensionValues: {
        dimension1: 80,
        dimension2: 65,
        dimension3: 70,
      },
    },
    {
      id: 6,
      order: 6,
      question: "How likely are you to recommend our platform to other organizations?",
      type: "NPS",
      weight: 10,
      status: "Active",
      options: {
        labels: Array.from({ length: 11 }, (_, i) => i.toString()),
      },
      npsValue: 8,
    },
    {
      id: 7,
      order: 7,
      question: "How satisfied are you with your current impact measurement process?",
      type: "Smiley face",
      weight: 5,
      status: "Active",
      options: {
        options: [
          { value: "1", label: "Not At All Likely" },
          { value: "2", label: "Slightly Likely" },
          { value: "3", label: "Somewhat Likely" },
          { value: "4", label: "Very Likely" },
        ],
      },
      selectedValue: "3",
    },
  ];
};

const renderQuestionComponent = (question: QuestionResponse) => {
  switch (question.type) {
    case "single-choice": {
      const options = formatChoiceOptions(question.options?.choices);
      return (
        <SingleChoiceQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.selectedValue}
          options={options}
        />
      );
    }
    case "Multi-select":
    case "Checkbox": {
      const options = formatChoiceOptions(question.options?.choices);
      return (
        <MultipleChoiceQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.selectedValues || []}
          options={options}
        />
      );
    }
    case "Slider": {
      const min = question.options?.min ?? 0;
      const value = question.sliderValue ?? min;
      return (
        <SliderQuestion
          question={question.question}
          questionNumber={question.order}
          min={question.options?.min}
          max={question.options?.max}
          step={question.options?.step}
          value={value}
          onChange={noop}
        />
      );
    }
    case "Multi-Slider":
      return (
        <div className="space-y-4">
          <p className="text-[#46B753] font-golos text-xl font-semibold">
            {question.order}. {question.question}
          </p>
          <div className="space-y-4">
            {question.dimensionValues && Object.keys(question.dimensionValues).length > 0 ? (
              Object.entries(question.dimensionValues).map(([key, value], idx) => {
                const dimension = question.options?.dimensions?.find((d) => d.code === key);
                return (
                  <SliderQuestion
                    key={key}
                    question={dimension?.label || `Dimension ${idx + 1}`}
                    questionNumber={undefined}
                    min={0}
                    max={100}
                    step={1}
                    value={value as number}
                    onChange={noop}
                  />
                );
              })
            ) : (
              <div className="text-sm text-gray-500">No dimension values available</div>
            )}
          </div>
        </div>
      );
    case "RATING":
      return (
        <StarRatingQuestion
          question={question.question}
          questionNumber={question.order}
          value={question.ratingValue ?? 0}
          maxStars={question.options?.maxStars ?? 5}
          labels={question.options?.labels}
        />
      );
    case "NPS": {
      const labels = question.options?.labels || [];
      const options = labels.map((label: string, index: number) => ({ value: index.toString(), label }));
      return (
        <VisualRatingQuestion
          question={question.question}
          questionNumber={question.order}
          options={options}
          value={question.npsValue !== undefined ? question.npsValue.toString() : undefined}
        />
      );
    }
    case "Smiley face": {
      const options = (question.options?.options || []).map((option: any) => ({
        value: option.value.toString(),
        label: option.label,
      }));
      return (
        <VisualRatingQuestion
          question={question.question}
          questionNumber={question.order}
          options={options}
          value={question.selectedValue}
        />
      );
    }
    default:
      return (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Answer data not available for this question type.
        </div>
      );
  }
};

const AssessmentResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();

  // Generate dummy responses based on assessmentId
  // TODO: Replace with actual API call
  const questionResponses: QuestionResponse[] = React.useMemo(() => {
    if (!assessmentId) return [];
    return generateDummyResponses(assessmentId);
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-30 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              Invalid assessment identifier.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-30 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <img src={BackIcon} alt="Back" className="w-8 h-8" />
              </button>
              <div>
                <h1
                  className="text-gray-800"
                  style={{
                    fontFamily: "Baskervville",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "32px",
                  }}
                >
                  Assessment Responses
                </h1>
              </div>
            </div>

            {questionResponses.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No assessment responses found.
              </div>
            ) : (
              <div className="space-y-5">
                {questionResponses.map((question) => (
                  <Card key={question.id} className="shadow-sm border border-gray-100">
                    <CardContent className="p-6">
                      <div className="pointer-events-none">{renderQuestionComponent(question)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentResponsesPage;

