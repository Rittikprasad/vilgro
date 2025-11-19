import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import type { QuestionChoiceItem, QuestionItem } from "../components/QuestionSection/QuestionListTable";
import SingleChoiceQuestion from "../../../components/ui/question/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../../components/ui/question/MultipleChoiceQuestion";
import SliderQuestion from "../../../components/ui/question/SliderQuestion";
import StarRatingQuestion from "../../../components/ui/question/StarRatingQuestion";
import VisualRatingQuestion from "../../../components/ui/question/VisualRatingQuestion";
import BackIcon from "../../../assets/svg/BackIcon.svg";

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

const sampleResponses: QuestionResponse[] = [
  {
    id: 1,
    order: 1,
    question: "How well is social impact integrated and aligned with the enterprise’s mission?",
    type: "single-choice",
    weight: 3,
    status: "Active",
    options: {
      type: "single-choice",
      choices: [
        { label: "Impact is peripheral and not central to the mission.", value: "impact_peripheral" },
        { label: "Some integration but with gaps; impact is important but not core.", value: "some_integration" },
        { label: "Impact is mostly integrated with minor gaps, a central objective.", value: "mostly_integrated" },
        { label: "Fully integrated and mission-aligned, with central focus on impact.", value: "fully_integrated" },
      ],
    },
    selectedValue: "fully_integrated",
  },
  {
    id: 2,
    order: 2,
    question: "What is the risk to adoption of innovation?",
    type: "Multi-select",
    weight: 2,
    status: "Active",
    options: {
      type: "multiple-choice",
      choices: [
        { label: "High likelihood of adoption with minimal hesitation.", value: "high_adoption" },
        { label: "Some hesitation, but likely to overcome with training.", value: "some_hesitation" },
        { label: "Significant hesitation with barriers to widespread adoption.", value: "significant_hesitation" },
        { label: "Very low likelihood without significant changes.", value: "very_low_adoption" },
      ],
    },
    selectedValues: ["high_adoption", "some_hesitation"],
  },
  {
    id: 3,
    order: 3,
    question: "On a scale of 0-10, how would you rate the clarity of your impact thesis?",
    type: "Slider",
    weight: 1,
    status: "Active",
    options: {
      min: 0,
      max: 10,
      step: 1,
    },
    sliderValue: 8,
  },
  {
    id: 4,
    order: 4,
    question: "Evaluate your performance across the following dimensions.",
    type: "Multi-Slider",
    weight: 2,
    status: "Active",
    options: {
      dimensions: [
        { code: "financial", label: "Financial Health", min_value: 0, max_value: 10 },
        { code: "social", label: "Social Impact", min_value: 0, max_value: 10 },
        { code: "risk", label: "Risk Management", min_value: 0, max_value: 10 },
      ],
    },
    dimensionValues: {
      financial: 7,
      social: 9,
      risk: 5,
    },
  },
  {
    id: 5,
    order: 5,
    question: "Rate the overall effectiveness of your intervention.",
    type: "RATING",
    weight: 1,
    status: "Active",
    options: {
      maxStars: 5,
      labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    },
    ratingValue: 4,
  },
  {
    id: 6,
    order: 6,
    question: "How likely are you to recommend this intervention to other SPOs?",
    type: "NPS",
    weight: 1,
    status: "Active",
    options: {
      labels: ["Not at all likely", "Slightly likely", "Somewhat likely", "Very likely"],
    },
    npsValue: 2,
  },
  {
    id: 7,
    order: 7,
    question: "How would you describe the current team morale?",
    type: "Smiley face",
    weight: 1,
    status: "Active",
    options: {
      options: [
        { label: "Very Low", value: 1 },
        { label: "Low", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "High", value: 4 },
      ],
    },
    selectedValue: "3",
  },
  {
    id: 8,
    order: 8,
    question: "Which support services do you currently leverage?",
    type: "Checkbox",
    weight: 1,
    status: "Active",
    options: {
      choices: [
        { label: "Capacity Building", value: "capacity_building" },
        { label: "Grant Funding", value: "grant_funding" },
        { label: "Technical Advisory", value: "technical_advisory" },
      ],
    },
    selectedValues: ["capacity_building", "technical_advisory"],
  },
];

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
          <p className="text-[#46B753] font-golos text-xl font-semibold">{question.question}</p>
          <div className="space-y-4">
            {question.options?.dimensions?.map((dimension: any, index: number) => (
              <SliderQuestion
                key={dimension.code}
                question={`${index + 1}. ${dimension.label}`}
                questionNumber={undefined}
                min={dimension.min_value}
                max={dimension.max_value}
                step={dimension.step || 1}
                value={
                  question.dimensionValues?.[dimension.code] ??
                  dimension.min_value ??
                  0
                }
                onChange={noop}
              />
            ))}
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

const SPOResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const { spoId } = useParams<{ spoId: string }>();

  return (
    <LayoutWrapper>
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
              SPO Assessment Responses
            </h1>
            <p className="text-sm text-gray-500">Showing recorded answers for SPO #{spoId ?? "—"}</p>
          </div>
        </div>

        <div className="space-y-5">
          {sampleResponses.map((question) => (
            <Card key={question.id} className="shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <div className="pointer-events-none">{renderQuestionComponent(question)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default SPOResponsesPage;

